using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TraceFlow.Application.Common.Exceptions;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Domain.Entities;
using TraceFlow.Domain.Exceptions;

namespace TraceFlow.Application.Features.Transfers.Commands.AcceptTransfer;

public record AcceptTransferCommand(Guid TransferId) : IRequest<Unit>;

public class AcceptTransferCommandValidator : AbstractValidator<AcceptTransferCommand>
{
    public AcceptTransferCommandValidator()
    {
        RuleFor(v => v.TransferId).NotEmpty();
    }
}

public class AcceptTransferCommandHandler : IRequestHandler<AcceptTransferCommand, Unit>
{
    private readonly IAppDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AcceptTransferCommandHandler(IAppDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(AcceptTransferCommand request, CancellationToken cancellationToken)
    {
        var transfer = await _context.Transfers
            .Include(t => t.ToOrganization)
            .FirstOrDefaultAsync(t => t.Id == request.TransferId, cancellationToken);

        if (transfer == null)
        {
            throw new NotFoundException(nameof(Transfer), request.TransferId);
        }

        // Authorization: Only users from the receiving organization can accept
        if (transfer.ToOrganizationId != _currentUserService.OrganizationId)
        {
            throw new UnauthorizedAccessException("Only the receiving organization can accept this transfer.");
        }

        // Complete the transfer
        transfer.Complete(_currentUserService.UserId!.Value);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
