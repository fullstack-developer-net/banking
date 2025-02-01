using Banking.Application.Dtos;
using Banking.Common.Models;
using Banking.Common.Services;
using Banking.Core.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Banking.Application.Requests.Commands
{
    public record RefreshTokenCommand(AuthenInfo Data) : IRequest<AuthenInfo?>;
    public class RefreshTokenCommandHandler(IOptions<JwtSettings> options, UserManager<User> userManager, TokenService tokenService) : IRequestHandler<RefreshTokenCommand, AuthenInfo?>
    {
        public async Task<AuthenInfo?> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {

            var principal = tokenService.GetPrincipalFromExpiredToken(request.Data.Token);

            var user = await userManager.GetUserAsync(principal);
            if (user == null || user.RefreshToken != request.Data.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return null;
            }

            var newJwtToken = tokenService.GenerateJwtToken(user);
            var newRefreshToken = tokenService.GetGenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(options.Value.RefreshTokenExpiryInDays);
            await userManager.UpdateAsync(user);
            request.Data.Token = newJwtToken;
            request.Data.RefreshToken = newRefreshToken;
            return request.Data;
        }
    }
}