using Banking.Core.Interfaces.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace Banking.Infrastructure.MessageQueue
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRabbitMq(this IServiceCollection services)
        {
            services.AddScoped<ISenderService, RabbitMqSenderService>();
            services.AddSingleton<IConnectionFactory>(sp =>
            {
                var rabbitMqSettings = sp.GetRequiredService<IOptions<RabbitMQSettings>>().Value;
                return new ConnectionFactory
                {
                    HostName = rabbitMqSettings.HostName ?? string.Empty,
                    Password = rabbitMqSettings.Password ?? string.Empty,
                    UserName = rabbitMqSettings.UserName ?? string.Empty,
                    Port = rabbitMqSettings.Port ?? 5672,
                    VirtualHost = rabbitMqSettings.VirtualHost
                };
            });
            return services;
        }
    }
}
