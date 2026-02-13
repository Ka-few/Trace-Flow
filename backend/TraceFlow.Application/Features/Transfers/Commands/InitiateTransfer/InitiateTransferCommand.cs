using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TraceFlow.Application.Common.Exceptions;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Domain.Entities;
using TraceFlow.Domain.Enums;
using TraceFlow.Domain.Exceptions;

namespace TraceFlow.Application.Features.Transfers.Commands.InitiateTransfer;

public record InitiateTransferCommand(
    Guid BatchId,
    Guid ToOrganizationId,
    decimal Quantity) : IRequest<Guid>;

public class InitiateTransferCommandValidator : AbstractValidator<InitiateTransferCommand>
{
    public InitiateTransferCommandValidator()
    {
        RuleFor(v => v.BatchId).NotEmpty();
        RuleFor(v => v.ToOrganizationId).NotEmpty();
        RuleFor(v => v.Quantity).GreaterThan(0);
    }
}

public class InitiateTransferCommandHandler : IRequestHandler<InitiateTransferCommand, Guid>
{
    private readonly IAppDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public InitiateTransferCommandHandler(IAppDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(InitiateTransferCommand request, CancellationToken cancellationToken)
    {
        var currentOrgId = _currentUserService.OrganizationId 
            ?? throw new UnauthorizedAccessException("User has no organization context.");

        var batch = await _context.Batches
            .Include(b => b.Organization)
            .FirstOrDefaultAsync(b => b.Id == request.BatchId, cancellationToken);

        if (batch == null)
            throw new NotFoundException(nameof(Batch), request.BatchId);

        if (batch.OrganizationId != currentOrgId)
            throw new DomainException("You can only transfer batches owned by your organization.");

        if (batch.Status != BatchStatus.ReadyForTransfer)
             throw new DomainException("Batch is not in a 'ReadyForTransfer' state.");

        // Create the Transfer entity
        var transfer = new Transfer(
            request.BatchId,
            currentOrgId,
            request.ToOrganizationId,
            request.Quantity,
            _currentUserService.UserId!.Value
        );

        _context.Transfers.Add(transfer);
        
        // Update batch status to InTransit? 
        // Or keep it ReadyForTransfer until accepted? 
        // For simple flow, let's say Initiating a transfer locks it or sets it to InTransit.
        // Let's assume the Batch entity has logic, or we update it here.
        // batch.Status = BatchStatus.InTransit; 

        await _context.SaveChangesAsync(cancellationToken);

        return transfer.Id;
    }
}
