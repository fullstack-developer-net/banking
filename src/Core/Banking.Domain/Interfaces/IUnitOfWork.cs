using Banking.Domain.Interfaces.Repositories;

namespace Banking.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IAccountRepository AccountRepository { get; }
        ITransactionRepository TransactionRepository { get; }
        Task<int> CompleteAsync();
    }
}
