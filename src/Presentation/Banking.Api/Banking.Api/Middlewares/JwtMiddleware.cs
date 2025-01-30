using Banking.Common.Helpers;
using Banking.Common.Models;
using Banking.Common.Services;
using Banking.Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Banking.Api.Middlewares
{
    public class JwtMiddleware(RequestDelegate next)
    {
        public async Task Invoke(HttpContext context, UserManager<User> userManager, TokenService tokenService, IOptions<JwtSettings> options)
        {
            var token = context.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();
            string? userId = null;
            if (token != null)
            {
                var principal = tokenService.GetPrincipalFromExpiredToken(token);

                var user = await userManager.GetUserAsync(principal);

                if (user != null)
                {
                    // attach user to context on successful jwt validation
                    context.Items["User"] = user;
                    context.Items["Role"] = await userManager.GetRolesAsync(user);
                    context.Items["UserId"] = userId;
                }
            }
            await next(context);
        }
    }
}
