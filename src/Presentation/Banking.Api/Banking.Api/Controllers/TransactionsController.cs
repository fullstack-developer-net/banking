using Banking.Application.Requests.Commands;
using Banking.Application.Requests.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Api.Controllers
{
    public class TransactionsController(IMediator mediator) : BaseApiController
    {
        [HttpGet("list")]
        public async Task<IActionResult> GetTransactions(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null)
        {
            var transactions = await mediator.Send(new GetTransactions(pageNumber, pageSize, searchTerm));
            return Ok(transactions);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction([FromBody] ProcessTransactionCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("/{id}")]
        public async Task<IActionResult> GetTransactionById(string id)
        {
            var transaction = await mediator.Send(new GetTransactionByIdQuery(id));
            if (transaction == null)
            {
                return NotFound();
            }
            return Ok(transaction);
        }
    }
}
