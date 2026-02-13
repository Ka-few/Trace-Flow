using FluentValidation;
using MediatR;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Domain.Entities;

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
        RuleFor(v => v.HarvestDate).NotEmpty();
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
