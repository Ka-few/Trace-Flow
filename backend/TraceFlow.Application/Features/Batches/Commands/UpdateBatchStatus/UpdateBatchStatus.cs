using MediatR;
using Microsoft.EntityFrameworkCore;
using TraceFlow.Application.Common.Exceptions;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Domain.Entities;
using TraceFlow.Domain.Enums;
using TraceFlow.Domain.Exceptions;

namespace TraceFlow.Application.Features.Batches.Commands.UpdateBatchStatus;

public record UpdateBatchStatusCommand(Guid BatchId, BatchStatus NewStatus) : IRequest;

public class UpdateBatchStatusCommandHandler : IRequestHandler<UpdateBatchStatusCommand>
{
    private readonly IAppDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateBatchStatusCommandHandler(IAppDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(UpdateBatchStatusCommand request, CancellationToken cancellationToken)
    {
        var currentOrgId = _currentUserService.OrganizationId 
            ?? throw new UnauthorizedAccessException("User has no organization context.");

        var batch = await _context.Batches
            .FirstOrDefaultAsync(b => b.Id == request.BatchId, cancellationToken);

        if (batch == null)
            throw new NotFoundException(nameof(Batch), request.BatchId);

        if (batch.OrganizationId != currentOrgId)
            throw new DomainException("You can only update batches owned by your organization.");

        // Transitions are already validated in the Domain entity's UpdateStatus method
        batch.UpdateStatus(request.NewStatus);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
