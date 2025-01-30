using Banking.Application.Dtos;
using Banking.Core.Entities.Identity;
using Banking.Core.Interfaces.Services;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Banking.Application.Commands
{
    public record LoginCommand(LoginDto LoginDto) : IRequest<string?>;
    public class LoginCommandHandler(UserManager<User> userManager, ITokenService tokenService) : IRequestHandler<LoginCommand, string?>
    {

        public async Task<string?> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByNameAsync(request.LoginDto.UserName);
            var checkPassword = await userManager.CheckPasswordAsync(user, request.LoginDto.Password);
            if (user != null && checkPassword)
            {
                var userRoles = await userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new(ClaimTypes.Name, request.LoginDto.UserName),
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }



                return tokenService.GenerateAccessToken(authClaims);
            }

            return null;
        }
    }
}