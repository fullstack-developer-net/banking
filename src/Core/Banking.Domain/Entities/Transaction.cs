using System.ComponentModel.DataAnnotations.Schema;

namespace Banking.Domain.Entities
{
    [Table("Transactions")]
    public class Transaction
    {
        public string TransactionId { get; set; } = Guid.NewGuid().ToString();
        public long FromAccountId { get; set; }
        public long ToAccountId { get; set; }
        public decimal Amount { get; set; }
        public DateTime TransactionTime { get; set; }
        public virtual Account? FromAccount { get; set; }
        public virtual Account? ToAccount { get; set; }
    }
}
