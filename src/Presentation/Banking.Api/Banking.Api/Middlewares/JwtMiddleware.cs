using Banking.Common.Helpers;
using Banking.Common.Models;
using Banking.Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Banking.Api.Middlewares
{

    public class JwtMiddleware(RequestDelegate next)
    {
        public async Task Invoke(HttpContext context, UserManager<User> userManager, IOptions<JwtSettings> options)
        {
            var token = context.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();
            string userId = string.Empty;
            if (token != null)
            {
                userId = token.ValidateToken(options.Value.SecretKey);
            }
            if (userId != null)
            {
                // attach user to context on successful jwt validation
                context.Items["User"] =await userManager.FindByIdAsync(userId);
                context.Items["UserId"] = userId;
            }
            await next(context);


        }
    }
}
