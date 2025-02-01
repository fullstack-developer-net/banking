using Banking.Core.Entities.Identity;

namespace Banking.Core.Entities
{
    public class Account
    {
        public string AccountNumber { get; set; } = string.Empty;
        public long AccountId { get; set; }
        public decimal Balance { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }

    }
}
