using Banking.Application.Dtos;
using Banking.Common.Helpers;
using Banking.Common.Models;
using Banking.Core.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Banking.Application.Commands
{
    public record LoginCommand(LoginDto LoginDto) : IRequest<string?>;
    public class LoginCommandHandler(IOptions<JwtSettings> options, UserManager<User> userManager) : IRequestHandler<LoginCommand, string?>
    {

        public async Task<string?> Handle(LoginCommand request, CancellationToken cancellationToken)
        {

            var user = await userManager.FindByNameAsync(request.LoginDto.UserName).ConfigureAwait(false);
            var checkPassword = await userManager.CheckPasswordAsync(user, request.LoginDto.Password).ConfigureAwait(false);
            if (user != null && checkPassword)
            {
                var userRoles = await userManager.GetRolesAsync(user).ConfigureAwait(false);

                var authClaims = new List<Claim>
                {
                    new(ClaimTypes.Name, request.LoginDto.UserName),
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                return JwtHelper.GenerateToken(user, options.Value.SecretKey);
            }

            return null;
        }
    }
}