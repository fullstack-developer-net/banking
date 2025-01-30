using System.Collections.Concurrent;

namespace Banking.Infrastructure.WebSocket
{
    public class ConnectionMapper : IConnectionMapper
    {
        private readonly ConcurrentDictionary<string, HashSet<string>> _connections = new();

        public void Add(string userId, string connectionId)
        {
            var connections = _connections.GetOrAdd(userId, _ => []);
            lock (connections)
            {
                connections.Add(connectionId);
            }
        }

        public void Remove(string connectionId)
        {
            foreach (var userId in _connections.Keys)
            {
                if (_connections.TryGetValue(userId, out var connections))
                {
                    lock (connections)
                    {
                        connections.Remove(connectionId);
                        if (connections.Count == 0)
                        {
                            _connections.TryRemove(userId, out _);
                        }
                    }
                }
            }
        }

        public IEnumerable<string> GetConnections(string userId)
        {
            if (_connections.TryGetValue(userId, out var connections))
            {
                return connections;
            }
            return [];
        }
    }
}
