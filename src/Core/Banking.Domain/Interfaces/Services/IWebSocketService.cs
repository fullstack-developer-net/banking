namespace Banking.Core.Interfaces.Services
{
    public interface IWebSocketService
    {
        Task SendAsync(string connectionId, string type, object message);
        Task SendToAllAsync(string type, object message);

        Task SendToUserAsync(string userId, string type, object message);
        Task SendToUsersAsync(IEnumerable<string> userIds, string type, object message);
    }
}
