using Banking.Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Banking.Domain.Entities
{
    [Table("Accounts")]
    public class Account
    {
        public long AccountId { get; set; }
        public string AccountNumber { get; set; }
        public decimal Balance { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }

    }
}
