using Banking.Application.Dtos;
using Banking.Common.Helpers;
using Banking.Common.Models;
using Banking.Common.Services;
using Banking.Core.Entities.Identity;
using Banking.Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Banking.Api.Middlewares
{
    public class JwtMiddleware(RequestDelegate next)
    {
        public async Task Invoke(HttpContext context, UserManager<User> userManager, IUnitOfWork unitOfWork,
            TokenService tokenService, CurrentLoginUser loginUser, IOptions<JwtSettings> options)
        {
            var token = context.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();
            if (token != null)
            {
                var principal = tokenService.GetPrincipalFromExpiredToken(token);

                var user = await userManager.GetUserAsync(principal);
                if (user != null)
                {
                    // attach user to context on successful jwt validation
                    context.Items["User"] = user;
                    context.Items["Role"] = await userManager.GetRolesAsync(user);
                    context.Items["UserId"] = user.Id;
                    loginUser.User = user;
                    var roles = await userManager.GetRolesAsync(user);
                    loginUser.Roles = roles.ToList();
                    loginUser.Account = await unitOfWork.AccountRepository.AsQueryable()
                        .FirstOrDefaultAsync(x => x.UserId == user.Id);
                }
                else
                {
                    loginUser.User = null;
                    loginUser.Roles = null;
                    loginUser.Account = null;
                }
            }

            await next(context);
        }
    }
}