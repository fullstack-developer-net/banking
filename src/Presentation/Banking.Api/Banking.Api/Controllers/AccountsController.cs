using Banking.Api.Filters;
using Banking.Application.Dtos;
using Banking.Application.Requests.Commands;
using Banking.Application.Requests.Queries;
using Banking.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace Banking.Api.Controllers
{

    public class AccountsController(IMediator mediator, IUnitOfWork unitOfWork) : BaseApiController
    {

        [HttpPost()]
        [AllowRoles(["ADMIN"])]
        public async Task<IActionResult> CreateAccount([FromBody] CreateAccountRequest command)
        {

            var accountId = await mediator.Send(new CreateAccountCommand(command));
            return Ok(new { AccountId = accountId });
        }

        [HttpGet("/{accountId}/transactions")]
        public async Task<IActionResult> GetTransactionsByAccountId(int accountId)
        {
            var transactions = await mediator.Send(new GetTransactionsByAccountIdQuery(accountId));
            return Ok(transactions);
        }

        [EnableQuery]
        [HttpGet]
        [Route("odata")]
        public IActionResult Get()
        {

            var accounts = unitOfWork.AccountRepository.AsQueryable().Select(a => new AccountDto
            {
                Email = a.User.Email ?? string.Empty,
                FullName = a.User.FullName,
                Balance = a.Balance,
                IsActive = a.IsActive,
            });
            return Ok(accounts);
        }


        [HttpPost("validate-registration")]
        public async Task<IActionResult> ValidateRegistration([FromBody] ValidateRegistrationCommand model)
        {
            return Ok(await mediator.Send(model));
        }

        [HttpGet("details")]
        public async Task<IActionResult> GetAccount(string? userId, string? accountNumber, long? accountId)
        {
            AccountDto? account = null;
            if (userId != null)
            {
                account = await mediator.Send(new GetAccountByUserId(userId));
            }
            else if (accountNumber != null)
            {
                account = await mediator.Send(new GetAccountByAccountNumber(accountNumber));
            }
            else if (accountId != null)
            {
                account = await mediator.Send(new GetAccountById(accountId.Value));
            }
            return Ok(account);
        }

    }
}
