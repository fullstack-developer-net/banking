using Banking.Core.Entities;
using Banking.Core.Interfaces;

namespace Banking.Core.Interfaces.Repositories
{
    public interface IAccountRepository : IGenericRepository<Account>
    {
        Task<Account?> GetAccountByUserIdAsync(string userId);
        Task<Account> GetByAccountNumberAsync(string accountNumber);
    }
}
