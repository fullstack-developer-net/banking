using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Banking.Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Banking.Api.Filters
{

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AllowRolesAttribute(params string[] roles) : AuthorizeAttribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            // skip authorization if action is decorated with [AllowAnonymous] attribute
            var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
            if (allowAnonymous)
                return;

            // authorization
            var user = (User)context.HttpContext.Items["User"];
             if (user == null)
                context.Result = new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
            var roles = (IdentityRole)context.HttpContext.Items["Roles"];

         }
    }

   
}
