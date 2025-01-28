namespace Banking.Application.Dtos
{
    public class TransactionDto
    {
        public string Id { get; set; }
        public long FromAccountId { get; set; }
        public long ToAccountId { get; set; }
        public decimal Amount { get; set; }
        public DateTime TransactionDate { get; set; }
    }
}
