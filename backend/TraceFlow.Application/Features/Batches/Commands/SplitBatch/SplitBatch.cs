using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TraceFlow.Application.Common.Exceptions;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Domain.Entities;
using TraceFlow.Domain.Enums;
using TraceFlow.Domain.Exceptions;

namespace TraceFlow.Application.Features.Batches.Commands.SplitBatch;

public record BatchSplitDefinition(
    decimal Quantity,
    string? ProductType = null,
    string? StrainOrVariety = null
);

public record SplitBatchCommand(
    Guid SourceBatchId,
    List<BatchSplitDefinition> Splits) : IRequest<List<Guid>>;

public class SplitBatchCommandValidator : AbstractValidator<SplitBatchCommand>
{
    public SplitBatchCommandValidator()
    {
        RuleFor(x => x.SourceBatchId).NotEmpty();
        RuleFor(x => x.Splits).NotEmpty().WithMessage("At least one split is required.");
        RuleForEach(x => x.Splits).ChildRules(split =>
        {
            split.RuleFor(s => s.Quantity).GreaterThan(0);
        });
    }
}

public class SplitBatchCommandHandler : IRequestHandler<SplitBatchCommand, List<Guid>>
{
    private readonly IAppDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public SplitBatchCommandHandler(IAppDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<List<Guid>> Handle(SplitBatchCommand request, CancellationToken cancellationToken)
    {
        var currentOrgId = _currentUserService.OrganizationId 
            ?? throw new UnauthorizedAccessException("User has no organization context.");

        // 1. Get source batch
        var sourceBatch = await _context.Batches
            .Include(b => b.Parents)
            .FirstOrDefaultAsync(b => b.Id == request.SourceBatchId, cancellationToken);

        if (sourceBatch == null)
            throw new NotFoundException(nameof(Batch), request.SourceBatchId);

        // 2. Validate ownership and state
        if (sourceBatch.OrganizationId != currentOrgId)
            throw new DomainException("You can only split batches owned by your organization.");

        if (sourceBatch.Status == BatchStatus.Closed || sourceBatch.Status == BatchStatus.Recalled || sourceBatch.Status == BatchStatus.Sold)
            throw new DomainException($"Cannot split a batch in the '{sourceBatch.Status}' state.");

        // 3. Pre-validate total quantity
        var totalRequestedQuantity = request.Splits.Sum(x => x.Quantity);
        if (sourceBatch.Quantity < totalRequestedQuantity)
        {
            throw new DomainException($"Insufficient quantity in source batch. Available: {sourceBatch.Quantity}, Total Requested in Splits: {totalRequestedQuantity}");
        }

        // 4. Perform splits in a transaction
        using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            var childIds = new List<Guid>();
            foreach (var split in request.Splits)
            {
                // Create the child batch
                var childBatch = new Batch(
                    sourceBatch.OrganizationId,
                    split.ProductType ?? sourceBatch.ProductType,
                    split.Quantity,
                    sourceBatch.HarvestDate,
                    sourceBatch.SiteId
                );

                if (!string.IsNullOrEmpty(split.StrainOrVariety))
                {
                    childBatch.SetStrainOrVariety(split.StrainOrVariety);
                }

                // Add child (handles domain logic, quantity deduction, and lineage)
                sourceBatch.AddChild(childBatch, split.Quantity);

                _context.Batches.Add(childBatch);
                childIds.Add(childBatch.Id);
            }

            await _context.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return childIds;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
