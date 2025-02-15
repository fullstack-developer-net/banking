using Banking.Application.Constants;
using Banking.Application.Dtos;
using Banking.Common.Constants;
using Banking.Core.Entities;
using Banking.Core.Entities.Identity;
using Banking.Core.Interfaces;
using Banking.Core.Interfaces.Services;
using Banking.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Banking.Application.Requests.Commands
{
    public record ProcessTransactionCommand(long FromAccountId, long ToAccountId, decimal Amount)
        : IRequest<TransactionMessage>;

    public class ProcessTransactionCommandHandler(
        BankingDbContext context,
        ISenderService sender,
        IWebSocketService webSocketService) : IRequestHandler<ProcessTransactionCommand, TransactionMessage>
    {
        public async Task<TransactionMessage> Handle(ProcessTransactionCommand request,
            CancellationToken cancellationToken)
        {
            var fromAccount = await context.Accounts.Include(x => x.User).AsNoTracking()
                .FirstOrDefaultAsync(x => x.AccountId == request.FromAccountId, cancellationToken);
            var toAccount = await context.Accounts.Include(x => x.User).AsNoTracking()
                .FirstOrDefaultAsync(x => x.AccountId == request.ToAccountId, cancellationToken);
            if (fromAccount == null || toAccount == null)
            {
                throw new Exception("Invalid account(s) supplied.");
            }

            if (fromAccount.Balance < request.Amount)
            {
                throw new Exception("Insufficient funds.");
            }

            fromAccount.Balance -= request.Amount;
            fromAccount.LockedBalance += request.Amount;
            // Create the transaction
            var transaction = new Transaction
            {
                FromAccountId = request.FromAccountId,
                ToAccountId = request.ToAccountId,
                Amount = request.Amount,
                TransactionTime = DateTime.UtcNow,
                Status = TransactionStatus.Pending,
                Note = "Transaction is pending."
            };

            // Initialize the transaction and store into the database
            await context.Transactions.AddAsync(transaction, cancellationToken);
            context.Accounts.Update(fromAccount);
            await context.SaveChangesAsync(cancellationToken);

            var message = new TransactionMessage
            {
                TransactionId = transaction.TransactionId,
                FromAccountId = transaction.FromAccountId,
                FromAccount = new AccountDto
                {
                    AccountId = transaction.FromAccountId,
                    AccountNumber = fromAccount.AccountNumber,
                    FullName = fromAccount.User.FullName,
                },
                ToAccount = new AccountDto
                {
                    AccountId = transaction.ToAccountId,
                    AccountNumber = toAccount.AccountNumber,
                    FullName = toAccount.User.FullName,
                },
                ToAccountId = transaction.ToAccountId,
                Amount = transaction.Amount,
                Status = transaction.Status,
                Note = transaction.Note,
                TransactionTime = transaction.TransactionTime,
            };

            // Send the transaction request to the queue
            await sender.SendMessageAsync(QueueNames.Transaction, message);
            await webSocketService.SendToAllAsync("event", new EventData
            {
                Id = Guid.NewGuid().ToString(),
                CreatedAt = DateTime.UtcNow,
                Type = EventTypes.TransactionCreated,
                Message = "Initialize transaction",
                Data = message
            });
            return message;
        }
    }
}