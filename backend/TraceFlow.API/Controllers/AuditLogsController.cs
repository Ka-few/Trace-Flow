using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TraceFlow.Application.Common.Models;
using TraceFlow.Application.Features.AuditLogs.Queries.GetAuditLogs;

namespace TraceFlow.API.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[Authorize(Policy = "RequireAdmin")]
public class AuditLogsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuditLogsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<AuditLogDto>>> GetAll(
        [FromQuery] string? entityId,
        [FromQuery] string? entityName,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = new GetAuditLogsQuery(entityId, entityName, pageNumber, pageSize);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
