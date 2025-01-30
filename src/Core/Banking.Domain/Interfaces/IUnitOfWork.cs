using Banking.Core.Interfaces.Repositories;

namespace Banking.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IAccountRepository AccountRepository { get; }
        ITransactionRepository TransactionRepository { get; }
        Task<int> CompleteAsync();
    }
}
