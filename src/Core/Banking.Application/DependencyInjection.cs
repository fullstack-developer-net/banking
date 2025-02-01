using Banking.Application.Requests.Commands;
using Banking.Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Banking.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<SignInManager<User>>();
            services.AddScoped<UserManager<User>>();
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateAccountCommand).Assembly));
            return services;
        }
    }
}
