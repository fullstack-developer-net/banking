using Banking.Core.Interfaces.Services;
using Microsoft.AspNetCore.SignalR;

namespace Banking.Infrastructure.WebSocket
{
    public class WebSocketService(IHubContext<BaseHub> hubContext) : IWebSocketService
    {
        public async Task SendAsync(string connectionId, string type, object message)
        {
            await hubContext.Clients.Client(connectionId).SendAsync(type, message);
        }

        public async Task SendToAllAsync(string type, object message)
        {
            await hubContext.Clients.All.SendAsync(type, message);
        }

        public async Task SendToUserAsync(string userId, string type, object message)
        {
            await hubContext.Clients.User(userId).SendAsync(type, message);
        }

        public async Task SendToUsersAsync(IEnumerable<string> userIds, string type, object message)
        {
            await hubContext.Clients.Users(userIds.ToList()).SendAsync(type, message);
        }
    }
}
