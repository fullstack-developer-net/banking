﻿using Banking.Application.Requests.Commands;
using Banking.Application.Requests.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Api.Controllers
{
    public class TransactionsController(IMediator mediator) : BaseApiController
    {

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
