using Banking.Application.Requests.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Api.Controllers;

public class StatisticalController(IMediator mediator) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetStatisticalData()
    {
        var statisticalData = await mediator.Send(new GetStatisticalDataQuery());
          return Ok(statisticalData);
    }
}

