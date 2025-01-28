using Banking.Domain.Entities.Identity;
using Banking.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Banking.Api.Middlewares
{
    public class JwtMiddleware(RequestDelegate next, ITokenService tokenService, UserManager<User> userManager)
    {
        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();

            if (token != null && tokenService.ValidateToken(token, out var claimsPrincipal))
            {
                var userId = claimsPrincipal.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
                if (userId != null)
                {
                    context.User = claimsPrincipal;
                    var user = await userManager.FindByIdAsync(userId);
                    if (user != null && user.UserTokens.Any(t => t.Value == token))
                    {
                        // Attach user to context on successful jwt validation
                        context.Items["User"] = user;
                    }
                }
            }

            await next(context);
        }
    }
}
