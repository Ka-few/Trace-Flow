using MediatR;
using Microsoft.EntityFrameworkCore;
using TraceFlow.Application.Common.Exceptions;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Application.DTOs.Batches;
using TraceFlow.Domain.Entities;

namespace TraceFlow.Application.Features.Batches.Queries.GetBatchById;

public record GetBatchByIdQuery(Guid Id) : IRequest<BatchDto>;

public class GetBatchByIdQueryHandler : IRequestHandler<GetBatchByIdQuery, BatchDto>
{
    private readonly IAppDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetBatchByIdQueryHandler(IAppDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<BatchDto> Handle(GetBatchByIdQuery request, CancellationToken cancellationToken)
    {
        var batch = await _context.Batches
            .Include(b => b.Organization)
            .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

        if (batch == null)
        {
            throw new NotFoundException(nameof(Batch), request.Id);
        }

        // Authorization: Users can only view batches from their organization (unless admin)
        if (_currentUserService.Role != "Admin" && 
            batch.OrganizationId != _currentUserService.OrganizationId)
        {
            throw new UnauthorizedAccessException("You can only view batches from your organization.");
        }

        return new BatchDto(
            batch.Id,
            batch.OrganizationId,
            batch.Organization.Name,
            batch.ProductType,
            batch.Quantity,
            batch.Status.ToString(),
            batch.SiteId,
            batch.CreatedAt,
            batch.CreatedBy?.ToString() ?? "System"
        );
    }
}
