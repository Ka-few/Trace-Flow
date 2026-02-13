using MediatR;
using Microsoft.EntityFrameworkCore;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Application.Common.Models;
using TraceFlow.Application.DTOs.Batches;

namespace TraceFlow.Application.Features.Batches.Queries.GetBatches;

public record GetBatchesQuery(
    Guid? OrganizationId = null,
    string? Status = null,
    int PageNumber = 1,
    int PageSize = 10
) : IRequest<PagedResult<BatchListDto>>;

public class GetBatchesQueryHandler : IRequestHandler<GetBatchesQuery, PagedResult<BatchListDto>>
{
    private readonly IAppDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetBatchesQueryHandler(IAppDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<PagedResult<BatchListDto>> Handle(GetBatchesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Batches
            .Include(b => b.Organization)
            .AsQueryable();

        // Filter by organization if user is not admin
        if (_currentUserService.Role != "Admin" && _currentUserService.OrganizationId.HasValue)
        {
            query = query.Where(b => b.OrganizationId == _currentUserService.OrganizationId.Value);
        }
        else if (request.OrganizationId.HasValue)
        {
            query = query.Where(b => b.OrganizationId == request.OrganizationId.Value);
        }

        // Filter by status if provided
        if (!string.IsNullOrEmpty(request.Status))
        {
            query = query.Where(b => b.Status.ToString() == request.Status);
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        // Apply pagination
        var batches = await query
            .OrderByDescending(b => b.CreatedAt)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(b => new BatchListDto(
                b.Id,
                b.ProductType,
                b.Quantity,
                b.Status.ToString(),
                b.Organization.Name,
                b.CreatedAt
            ))
            .ToListAsync(cancellationToken);

        return new PagedResult<BatchListDto>(batches, totalCount, request.PageNumber, request.PageSize);
    }
}
