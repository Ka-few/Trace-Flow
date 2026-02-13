using MediatR;
using Microsoft.EntityFrameworkCore;
using TraceFlow.Application.Common.Interfaces;
using TraceFlow.Application.Common.Models;

namespace TraceFlow.Application.Features.AuditLogs.Queries.GetAuditLogs;

public record GetAuditLogsQuery(
    string? EntityId = null,
    string? EntityName = null,
    int PageNumber = 1,
    int PageSize = 20
) : IRequest<PagedResult<AuditLogDto>>;

public record AuditLogDto(
    Guid Id,
    string EntityName,
    string EntityId,
    string ActionType,
    string? BeforeData,
    string? AfterData,
    Guid? UserId,
    DateTime Timestamp
);

public class GetAuditLogsQueryHandler : IRequestHandler<GetAuditLogsQuery, PagedResult<AuditLogDto>>
{
    private readonly IAppDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetAuditLogsQueryHandler(IAppDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<PagedResult<AuditLogDto>> Handle(GetAuditLogsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.AuditLogs.AsQueryable();

        // Filter by entity name if provided
        if (!string.IsNullOrEmpty(request.EntityName))
        {
            query = query.Where(a => a.EntityName == request.EntityName);
        }

        // Filter by entity ID if provided
        if (!string.IsNullOrEmpty(request.EntityId))
        {
            query = query.Where(a => a.EntityId == request.EntityId);
        }

        // Get total count
        var totalCount = await query.CountAsync(cancellationToken);

        // Apply pagination
        var logs = await query
            .OrderByDescending(a => a.Timestamp)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(a => new AuditLogDto(
                a.Id,
                a.EntityName,
                a.EntityId,
                a.ActionType,
                a.BeforeData,
                a.AfterData,
                a.UserId,
                a.Timestamp
            ))
            .ToListAsync(cancellationToken);

        return new PagedResult<AuditLogDto>(logs, totalCount, request.PageNumber, request.PageSize);
    }
}

