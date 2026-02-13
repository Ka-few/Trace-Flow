using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TraceFlow.Application.Common.Models;
using TraceFlow.Application.DTOs.Batches;
using TraceFlow.Application.Features.Batches.Commands.CreateBatch;
using TraceFlow.Application.Features.Batches.Commands.SplitBatch;
using TraceFlow.Application.Features.Batches.Queries.GetBatches;
using TraceFlow.Application.Features.Batches.Queries.GetBatchById;

namespace TraceFlow.API.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[Authorize]
public class BatchesController : ControllerBase
{
    private readonly IMediator _mediator;

    public BatchesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<BatchListDto>>> GetAll(
        [FromQuery] Guid? organizationId, 
        [FromQuery] string? status,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = new GetBatchesQuery(organizationId, status, pageNumber, pageSize);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BatchDto>> GetById(Guid id)
    {
        var query = new GetBatchByIdQuery(id);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create(CreateBatchCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = result }, result);
    }

    [HttpPost("split")]
    public async Task<ActionResult<List<Guid>>> Split(SplitBatchCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
