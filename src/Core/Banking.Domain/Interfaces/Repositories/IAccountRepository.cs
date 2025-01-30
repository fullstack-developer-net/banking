using Banking.Core.Entities;

namespace Banking.Core.Interfaces.Repositories
{
    public interface IAccountRepository : IGenericRepository<Account>
    {
        Task<Account?> GetAccountByUserIdAsync(string userId);
     }
}
