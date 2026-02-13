using MediatR;
using Microsoft.AspNetCore.Mvc;
using TraceFlow.Application.Features.Batches.Commands.CreateBatch;

namespace TraceFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BatchesController : ControllerBase
{
    private readonly IMediator _mediator;

    public BatchesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create(CreateBatchCommand command)
    {
        return await _mediator.Send(command);
    }
}
