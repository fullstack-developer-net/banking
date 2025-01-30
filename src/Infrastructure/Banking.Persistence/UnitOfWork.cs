using Banking.Core.Interfaces;
using Banking.Core.Interfaces.Repositories;

namespace Banking.Persistence
{
    public class UnitOfWork(BankingDbContext context, IAccountRepository accountRepository, ITransactionRepository transactionRepository) : IUnitOfWork
    {
        public BankingDbContext Context { get; } = context;
        public IAccountRepository AccountRepository { get; } = accountRepository;

        public ITransactionRepository TransactionRepository { get; } = transactionRepository;

        public async Task<int> CompleteAsync()
        {
            return await Context.SaveChangesAsync();
        }

        public void Dispose() => Context.Dispose();
    }
}
