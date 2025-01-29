namespace Banking.Application.Dtos
{
    public record TransactionMessage
    {
        public string TransactionId { get; set; }
        public long FromAccountId { get; set; }
        public long ToAccountId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public string Note { get; set; }
        public DateTime TransactionTime { get; set; }
    }
}
