using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TraceFlow.Application.Common.Exceptions;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Domain.Entities;
using TraceFlow.Domain.Exceptions;

namespace TraceFlow.Application.Features.Batches.Commands.CreateBatch;

public record CreateBatchCommand(
    Guid OrganizationId,
    string ProductType,
    decimal Quantity,
    DateTime HarvestDate,
    Guid? SiteId) : IRequest<Guid>;

public class CreateBatchCommandValidator : AbstractValidator<CreateBatchCommand>
{
    public CreateBatchCommandValidator()
    {
        RuleFor(v => v.OrganizationId).NotEmpty();
        RuleFor(v => v.ProductType).NotEmpty().MaximumLength(100);
        RuleFor(v => v.Quantity).GreaterThan(0);
        RuleFor(v => v.HarvestDate)
            .NotEmpty()
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Harvest date cannot be in the future.")
            .GreaterThan(new DateTime(2000, 1, 1)).WithMessage("Harvest date must be after year 2000.");
    }
}

public class CreateBatchCommandHandler : IRequestHandler<CreateBatchCommand, Guid>
{
    private readonly IAppDbContext _context;

    public CreateBatchCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateBatchCommand request, CancellationToken cancellationToken)
    {
        // Validate Organization existence
        var organizationExists = await _context.Organizations
            .AnyAsync(o => o.Id == request.OrganizationId, cancellationToken);

        if (!organizationExists)
            throw new NotFoundException(nameof(Organization), request.OrganizationId);

        // Validate Site existence and ownership if provided
        if (request.SiteId.HasValue)
        {
            var site = await _context.ProductionSites
                .FirstOrDefaultAsync(s => s.Id == request.SiteId.Value, cancellationToken);

            if (site == null)
                throw new NotFoundException(nameof(ProductionSite), request.SiteId.Value);

            if (site.OrganizationId != request.OrganizationId)
                throw new DomainException($"Site {request.SiteId.Value} does not belong to organization {request.OrganizationId}.");
        }

        var batch = new Batch(
            request.OrganizationId,
            request.ProductType,
            request.Quantity,
            request.HarvestDate,
            request.SiteId
        );

        _context.Batches.Add(batch);
        
        await _context.SaveChangesAsync(cancellationToken);

        return batch.Id;
    }
}
