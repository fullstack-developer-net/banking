using Banking.Api.Filters;
using Banking.Application.Dtos;
using Banking.Application.Requests.Commands;
using Banking.Common.Helpers;
using Banking.Common.Models;
using Banking.Core.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Banking.Api.Controllers
{

    public class UsersController(
        IMediator mediator,
        IOptions<JwtSettings> options,
        UserManager<User> userManager
         ) : BaseApiController
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await mediator.Send(new LoginCommand(loginDto));

            return result == null ? BadRequest("Login failure") : Ok(result);
        }

        [HttpPost("logout")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> Logout()
        {
            await mediator.Send(new LogoutCommand());
            return Ok("Logout successful.");
        }


        [HttpPost("password")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCommand command)
        {
            await mediator.Send(command);
            return Ok();
        }
        [HttpPost("test-websocket")]
        public async Task<IActionResult> Test()
        {
            var data = new EventData
            {
                UserId = "1",
                Type = "Test",
                CreatedAt = DateTime.Now,
                Message = "Test message"
            };
            var result = mediator.Send(new SendEventCommand(data));

            return result == null ? BadRequest("Login failure") : Ok(result);
        }
        [HttpPost("create-admin-account")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateAdminAccount([FromBody] CreateUserDto user)
        {
            var password = $"P@ssw0rd{DateTime.UtcNow.Second}{CommonHelper.RandomString(6)}";

            var newUser = new User
            {
                UserName = user.Email,
                Email = user.Email,
                FullName = user.FullName,
                TemporaryPassword = password,
                IsActive = true,
            };

            var result = await userManager.CreateAsync(newUser, password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            await userManager.AddToRoleAsync(newUser, "User");
            return Ok(result);
        }
        [HttpPost("validate-token")]
        [AllowAnonymous]
        public async Task<IActionResult> ValidateToken(string token)
        {
            return Ok(JwtHelper.ValidateToken(token, options.Value.SecretKey));
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] AuthenInfo model)
        {
            var result = await mediator.Send(new RefreshTokenCommand(new AuthenInfo
            {
                Token = model.Token,
                RefreshToken = model.RefreshToken
            }));
            return result == null ? BadRequest("Invalid token") : Ok(result);
        }

        [HttpPost("exists")]
        public async Task<IActionResult> Exists(string email)
        {
            return Ok(await userManager.FindByEmailAsync(email) != null);
        }
    }
}
