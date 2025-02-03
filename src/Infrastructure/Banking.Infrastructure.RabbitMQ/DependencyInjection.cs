using Banking.Core.Interfaces.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace Banking.Infrastructure.MessageQueue
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRabbitMQ(this IServiceCollection services)
        {
            services.AddScoped<ISenderService, RabbitMQSenderService>();
            services.AddSingleton<IConnectionFactory>(sp =>
            {
                var rabbitMQSettings = sp.GetRequiredService<IOptions<RabbitMQSettings>>().Value;
                return new ConnectionFactory
                {
                    HostName = rabbitMQSettings.HostName ?? string.Empty,
                    Password = rabbitMQSettings.Password ?? string.Empty,
                    UserName = rabbitMQSettings.UserName ?? string.Empty,
                    Port = rabbitMQSettings.Port ?? 5672,
                    VirtualHost = rabbitMQSettings.VirtualHost ?? string.Empty,
                };
            });
            return services;
        }
    }
}
