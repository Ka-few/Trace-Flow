using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TraceFlow.Application.Features.Transfers.Commands.InitiateTransfer;

namespace TraceFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransfersController : ControllerBase
{
    private readonly IMediator _mediator;

    public TransfersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Initiate(InitiateTransferCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
