using Banking.Core.Entities;
using Banking.Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Banking.Persistence.Repositories
{
    public class AccountRepository(BankingDbContext context) : GenericRepository<Account>(context), IAccountRepository
    {
        public async Task<Account?> GetAccountByUserIdAsync(string userId)
        {
            return await context.Set<Account>().FirstOrDefaultAsync(a => a.UserId == userId);
        }
 
    }
}
