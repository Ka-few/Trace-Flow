using MediatR;
using Microsoft.EntityFrameworkCore;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Application.DTOs.Transfers;

namespace TraceFlow.Application.Features.Transfers.Queries.GetTransfers;

public record GetTransfersQuery(
    Guid? BatchId = null,
    string? Status = null
) : IRequest<List<TransferListDto>>;

public class GetTransfersQueryHandler : IRequestHandler<GetTransfersQuery, List<TransferListDto>>
{
    private readonly IAppDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetTransfersQueryHandler(IAppDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<List<TransferListDto>> Handle(GetTransfersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Transfers
            .Include(t => t.Batch)
            .Include(t => t.FromOrganization)
            .Include(t => t.ToOrganization)
            .AsQueryable();

        // Filter by organization (user can see transfers they're involved in)
        if (_currentUserService.Role != "Admin" && _currentUserService.OrganizationId.HasValue)
        {
            var orgId = _currentUserService.OrganizationId.Value;
            query = query.Where(t => t.FromOrganizationId == orgId || t.ToOrganizationId == orgId);
        }

        // Filter by batch if provided
        if (request.BatchId.HasValue)
        {
            query = query.Where(t => t.BatchId == request.BatchId.Value);
        }

        // Filter by status if provided
        if (!string.IsNullOrEmpty(request.Status))
        {
            query = query.Where(t => t.Status.ToString() == request.Status);
        }

        var transfers = await query
            .OrderByDescending(t => t.InitiatedAt)
            .Select(t => new TransferListDto(
                t.Id,
                t.Batch.ProductType,
                t.FromOrganization.Name,
                t.ToOrganization.Name,
                t.QuantityTransferred,
                t.Status.ToString(),
                t.InitiatedAt
            ))
            .ToListAsync(cancellationToken);

        return transfers;
    }
}
