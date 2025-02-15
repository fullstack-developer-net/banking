using Microsoft.AspNetCore.SignalR;

namespace Banking.Infrastructure.WebSocket
{
    public class BaseHub(IConnectionMapper connectionMapper) : Hub
    {
        public override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            if (httpContext == null) return base.OnConnectedAsync();
            var userId = httpContext.Items["userId"]?.ToString();
            if (!string.IsNullOrEmpty(userId))
            {
                connectionMapper.Add(userId, httpContext.Connection.Id);
            }
            return base.OnConnectedAsync();
        }

       
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (exception == null)
            {
                // Add logging or other handling for null exception
                Console.WriteLine("Disconnected with no exception.");
            }
            else
            {
                // Log the exception or handle it properly
                Console.WriteLine("Disconnected with exception: " + exception.Message);
            }

            await base.OnDisconnectedAsync(exception); 
        }

    }
}
