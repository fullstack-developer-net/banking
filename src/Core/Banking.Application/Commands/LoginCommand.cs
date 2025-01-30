using Banking.Application.Dtos;
using Banking.Common.Models;
using Banking.Common.Services;
using Banking.Core.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Banking.Application.Commands
{
    public record LoginCommand(LoginDto LoginDto) : IRequest<RefreshTokenDto?>;
    public class LoginCommandHandler(IOptions<JwtSettings> options, UserManager<User> userManager, SignInManager<User> signInManager, TokenService tokenService) : IRequestHandler<LoginCommand, RefreshTokenDto?>
    {

        public async Task<RefreshTokenDto?> Handle(LoginCommand request, CancellationToken cancellationToken)
        {

            var user = await userManager.FindByNameAsync(request.LoginDto.UserName);
            var checkPassword = await userManager.CheckPasswordAsync(user, request.LoginDto.Password).ConfigureAwait(false);
            if (user != null && checkPassword)
            {
                var jwtToken = tokenService.GenerateJwtToken(user);
                var refreshToken = tokenService.GetGenerateRefreshToken();

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.Now.AddDays(options.Value.RefreshTokenExpiryInDays);
                await userManager.UpdateAsync(user);

                return new RefreshTokenDto
                {
                    Token = jwtToken,
                    RefreshToken = refreshToken
                };
            }
            return null;
        }
    }
}