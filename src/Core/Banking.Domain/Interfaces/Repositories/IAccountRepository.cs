using Banking.Domain.Entities;

namespace Banking.Domain.Interfaces.Repositories
{
    public interface IAccountRepository : IGenericRepository<Account>
    {
        Task<Account?> GetAccountByUserIdAsync(string userId);
        Task<Account> GetByAccountNumberAsync(string accountNumber);
    }
}
