namespace Banking.Infrastructure.WebSocket
{
    public interface IConnectionMapper
    {
        void Add(string userId, string connectionId);
        void Remove(string connectionId);
        IEnumerable<string> GetConnections(string userId);
    }
}
