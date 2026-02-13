using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TraceFlow.Application.Common.Exceptions;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Domain.Entities;
using TraceFlow.Domain.Exceptions;

namespace TraceFlow.Application.Features.Transfers.Commands.CancelTransfer;

public record CancelTransferCommand(Guid TransferId) : IRequest<Unit>;

public class CancelTransferCommandValidator : AbstractValidator<CancelTransferCommand>
{
    public CancelTransferCommandValidator()
    {
        RuleFor(v => v.TransferId).NotEmpty();
    }
}

public class CancelTransferCommandHandler : IRequestHandler<CancelTransferCommand, Unit>
{
    private readonly IAppDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CancelTransferCommandHandler(IAppDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(CancelTransferCommand request, CancellationToken cancellationToken)
    {
        var transfer = await _context.Transfers
            .Include(t => t.FromOrganization)
            .FirstOrDefaultAsync(t => t.Id == request.TransferId, cancellationToken);

        if (transfer == null)
        {
            throw new NotFoundException(nameof(Transfer), request.TransferId);
        }

        // Authorization: Only users from the sending organization can cancel
        if (transfer.FromOrganizationId != _currentUserService.OrganizationId)
        {
            throw new UnauthorizedAccessException("Only the sending organization can cancel this transfer.");
        }

        // Cancel the transfer
        transfer.Cancel();

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
