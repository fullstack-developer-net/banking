using Banking.Core.Entities.Identity;
using Banking.Core.Entities;

namespace Banking.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<Account> AccountRepository { get; }
        IGenericRepository<User> UserRepository { get; }
        IGenericRepository<Role> RoleRepository { get; }
        IGenericRepository<Transaction> TransactionRepository { get; }
        Task<int> CompleteAsync();
    }
}
