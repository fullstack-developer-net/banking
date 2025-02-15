using Banking.Core.Interfaces.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Banking.Infrastructure.WebSocket
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddSignalRWebSocket(this IServiceCollection services)
        {
            services.AddSignalR();
            services.AddTransient<IWebSocketService, WebSocketService>();
            services.AddSingleton<IConnectionMapper, ConnectionMapper>();

            return services;
        }
    }
}
