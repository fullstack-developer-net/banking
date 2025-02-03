using Banking.Core.Entities.Identity;
using Banking.Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace Banking.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Account> AccountRepository { get; }
        IGenericRepository<User> UserRepository { get; }
        IGenericRepository<Role> RoleRepository { get; }
        IGenericRepository<IdentityUserRole<string>> UserRoleRepository { get; }
        IGenericRepository<Transaction> TransactionRepository { get; }
        Task<int> CompleteAsync();
    }
}
