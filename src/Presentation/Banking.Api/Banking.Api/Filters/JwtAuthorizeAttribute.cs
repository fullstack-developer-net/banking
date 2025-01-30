using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Banking.Core.Entities.Identity;
using Banking.Core.Interfaces.Services;

namespace Banking.Api.Filters
{
    public class JwtAuthorizeAttribute : TypeFilterAttribute
    {
        public JwtAuthorizeAttribute() : base(typeof(JwtAuthorizeFilter))
        {
        }
    }

    public class JwtAuthorizeFilter : IAuthorizationFilter
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<User> _userManager;

        public JwtAuthorizeFilter(ITokenService tokenService, UserManager<User> userManager)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var token = context.HttpContext.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();

            if (token != null && _tokenService.ValidateToken(token, out var claimsPrincipal))
            {
                var userId = claimsPrincipal.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
                if (userId != null)
                {
                    var user = _userManager.FindByIdAsync(userId).Result;
                    if (user != null && user.UserTokens.Any(t => t.Value == token))
                    {
                        // Attach user to context on successful jwt validation
                        context.HttpContext.User = claimsPrincipal;
                        return;
                    }
                }
            }

            // If jwt validation fails, set the result to unauthorized
            context.Result = new UnauthorizedResult();
        }
    }
}
