using Banking.Application.Dtos;
using Banking.Common.Models;
using Banking.Common.Services;
using Banking.Core.Entities.Identity;
using Banking.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Banking.Application.Commands
{
    public record LoginCommand(LoginDto LoginDto) : IRequest<AuthenInfo?>;
    public class LoginCommandHandler(IOptions<JwtSettings> options, UserManager<User> userManager, TokenService tokenService, IUnitOfWork unitOfWork) : IRequestHandler<LoginCommand, AuthenInfo?>
    {

        public async Task<AuthenInfo?> Handle(LoginCommand request, CancellationToken cancellationToken)
        {

            var user = await userManager.FindByNameAsync(request.LoginDto.UserName);
            var checkPassword = await userManager.CheckPasswordAsync(user, request.LoginDto.Password).ConfigureAwait(false);
            if (user != null && checkPassword)
            {
                var jwtToken = tokenService.GenerateJwtToken(user);
                var refreshToken = tokenService.GetGenerateRefreshToken();

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.Now.AddDays(options.Value.RefreshTokenExpiryInDays);
                var roles = await userManager.GetRolesAsync(user);
                await userManager.UpdateAsync(user);
                var account = await unitOfWork.AccountRepository.AsQueryable().FirstOrDefaultAsync(a => a.UserId == user.Id, cancellationToken: cancellationToken);
                return new AuthenInfo
                {
                    UserId = user.Id,
                    FullName = user.FullName,
                    Roles = [.. roles],
                    AccountId = account?.AccountId,
                    UserName = user.UserName,
                    Token = jwtToken,
                    RefreshToken = refreshToken
                };
            }
            return null;
        }
    }
}