using Banking.Application.Commands;
using Banking.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Api.Controllers
{
    public class TransactionsController(IMediator mediator) : BaseBankingController
    {

        [HttpPost]
        public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionCommand command)
        {

            var transactionId = await mediator.Send(command);
            return Ok(new { TransactionId = transactionId });
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
