namespace Banking.Application.Dtos
{
    public class EventData
    {
        public string Type { get; set; }
        public string Id { get; set; }
        public object? Data { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string Message { get; set; }
        public object AccountId { get; set; }
    }
}
