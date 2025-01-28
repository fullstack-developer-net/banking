using Banking.Domain.Entities;
using Banking.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Banking.Persistence.Repositories
{
    public class TransactionRepository(BankingDbContext context) : GenericRepository<Transaction>(context), ITransactionRepository
    {
        public async Task<IEnumerable<Transaction>> GetByFromAccountIdAsync(int accountId)
        {
            return await context.Set<Transaction>().Where(t => t.FromAccountId == accountId).ToListAsync();
        }

        public async Task<IEnumerable<Transaction>> GetByToAccountIdAsync(int accountId)
        {
            return await context.Set<Transaction>().Where(t => t.ToAccountId == accountId).ToListAsync();
        }

          
    }
}
