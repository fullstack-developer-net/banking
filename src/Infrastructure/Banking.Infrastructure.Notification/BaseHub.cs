using Banking.Core;
using Microsoft.AspNetCore.SignalR;

namespace Banking.Infrastructure.WebSocket
{
    public class BaseHub(IConnectionMapper connectionMapper, CurrentLoginUser loginUser) : Hub
    {
        public override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            if (httpContext == null) return base.OnConnectedAsync();
             if (!string.IsNullOrEmpty(loginUser.User?.Id))
            {
                connectionMapper.Add(loginUser.User?.Id, httpContext.Connection.Id);
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
