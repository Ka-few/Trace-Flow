using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TraceFlow.Application.DTOs.Transfers;
using TraceFlow.Application.Features.Transfers.Commands.AcceptTransfer;
using TraceFlow.Application.Features.Transfers.Commands.CancelTransfer;
using TraceFlow.Application.Features.Transfers.Commands.InitiateTransfer;
using TraceFlow.Application.Features.Transfers.Queries.GetTransfers;

namespace TraceFlow.API.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[Authorize]
public class TransfersController : ControllerBase
{
    private readonly IMediator _mediator;

    public TransfersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<TransferListDto>>> GetAll([FromQuery] Guid? batchId, [FromQuery] string? status)
    {
        var query = new GetTransfersQuery(batchId, status);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Initiate(InitiateTransferCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id}/accept")]
    public async Task<IActionResult> Accept(Guid id)
    {
        await _mediator.Send(new AcceptTransferCommand(id));
        return NoContent();
    }

    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        await _mediator.Send(new CancelTransferCommand(id));
        return NoContent();
    }
}
