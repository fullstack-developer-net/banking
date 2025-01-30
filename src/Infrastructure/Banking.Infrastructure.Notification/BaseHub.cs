using Microsoft.AspNetCore.SignalR;

namespace Banking.Infrastructure.WebSocket
{
    public class BaseHub(IConnectionMapper connectionMapper) : Hub
    {
        public override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            if (httpContext != null)
            {
                var userId = httpContext.Items["userId"]?.ToString();
                if (!string.IsNullOrEmpty(userId))
                {
                    connectionMapper.Add(userId, httpContext.Connection.Id);
                }
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            ArgumentNullException.ThrowIfNull(exception);

            var httpContext = Context.GetHttpContext();
            if (httpContext != null)
            {
                var userId = httpContext.Items["userId"]?.ToString();
                if (!string.IsNullOrEmpty(userId))
                {
                    connectionMapper.Remove(httpContext.Connection.Id);
                }
            }
            return base.OnDisconnectedAsync(exception);
        }

    }
}
