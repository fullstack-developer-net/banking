using Banking.Core.Entities;

namespace Banking.Core.Interfaces.Repositories
{
    public interface ITransactionRepository : IGenericRepository<Transaction>
    {
        Task<IEnumerable<Transaction>> GetByFromAccountIdAsync(int accountId);
        Task<IEnumerable<Transaction>> GetByToAccountIdAsync(int accountId);

    }
}
