using Banking.Application.Commands;
using Banking.Application.Services;
using Banking.Domain.Entities.Identity;
using Banking.Domain.Interfaces;
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
            services.AddScoped<ITokenService, TokenService>();
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateAccountCommand).Assembly));
            return services;
        }
    }
}
