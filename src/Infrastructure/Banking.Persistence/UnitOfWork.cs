using Banking.Core.Entities;
using Banking.Core.Entities.Identity;
using Banking.Core.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Banking.Persistence
{
    public class UnitOfWork(BankingDbContext context) : IUnitOfWork
    {
        public IGenericRepository<Account> AccountRepository { get; } = new GenericRepository<Account>(context);
        public IGenericRepository<User> UserRepository { get; } = new GenericRepository<User>(context);
        public IGenericRepository<Role> RoleRepository { get; } = new GenericRepository<Role>(context);
        public IGenericRepository<Transaction> TransactionRepository { get; } = new GenericRepository<Transaction>(context);
        public IGenericRepository<IdentityUserRole<string>> UserRoleRepository { get; } = new GenericRepository<IdentityUserRole<string>>(context);
        public async Task<int> CompleteAsync()
        {
            return await context.SaveChangesAsync();
        }

        public void Dispose() => context.Dispose();
    }
}
