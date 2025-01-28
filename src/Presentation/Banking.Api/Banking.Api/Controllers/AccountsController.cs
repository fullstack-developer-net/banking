using Banking.Application.Commands;
using Banking.Application.Dtos;
using Banking.Application.Queries;
using Banking.Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace Banking.Api.Controllers
{

    public class AccountsController(IMediator mediator, IUnitOfWork unitOfWork) : BaseBankingController
    {

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await mediator.Send(new LoginCommand(loginDto));

            return result == null ? BadRequest("Login failure") : Ok(result);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await mediator.Send(new LogoutCommand());
            return Ok("Logout successful.");
        }


        [HttpPost("password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCommand command)
        {
            await mediator.Send(command);
            return Ok();
        }
        [HttpPost()]
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
                AccountNumber = a.AccountNumber,
                Balance = a.Balance,
                IsActive = a.IsActive,
            });
            return Ok(accounts);
        }
    }
}
