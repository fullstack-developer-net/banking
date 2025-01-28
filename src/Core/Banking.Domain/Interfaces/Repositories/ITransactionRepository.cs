using Banking.Domain.Entities;

namespace Banking.Domain.Interfaces.Repositories
{
    public interface ITransactionRepository : IGenericRepository<Transaction>
    {
        Task<IEnumerable<Transaction>> GetByFromAccountIdAsync(int accountId);
        Task<IEnumerable<Transaction>> GetByToAccountIdAsync(int accountId);

    }
}
