using Banking.Application.Constants;
using Banking.Application.Dtos;
using Banking.Common.Constants;
using Banking.Common.Helpers;
using Banking.Core.Interfaces;
using Banking.Core.Interfaces.Services;
using Banking.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace Banking.Application.Requests.Commands
{
    public record ProcessBatchTransactionCommand(string TransactionId) : IRequest<bool>;

    public class ProcessBatchTransactionCommandHandler(
        IServiceProvider serviceProvider) : IRequestHandler<ProcessBatchTransactionCommand, bool>
    {
        public async Task<bool> Handle(ProcessBatchTransactionCommand request, CancellationToken cancellationToken)
        {
            var eventData = new EventData
            {
                Id = Guid.NewGuid().ToString(),
                CreatedAt = DateTime.UtcNow
            };
            using var scope = serviceProvider.CreateScope();
            var webSocketService = scope.ServiceProvider.GetRequiredService<IWebSocketService>();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var context = scope.ServiceProvider.GetRequiredService<BankingDbContext>();
            var transaction = context.Transactions
                .Include(x => x.FromAccount).ThenInclude(x => x.User)
                .Include(x => x.ToAccount).ThenInclude(x => x.User)
                .FirstOrDefault(x => x.TransactionId == request.TransactionId);

            var fromAccount = await unitOfWork.AccountRepository.GetByIdAsync(transaction.FromAccountId);
            var toAccount = await unitOfWork.AccountRepository.GetByIdAsync(transaction.ToAccountId);

            var fromAccountBalance = fromAccount.Balance;
            var toAccountBalance = toAccount.Balance;
            var transactionAmount = transaction.Amount;
            var fromAccountLockedBalance = fromAccount.LockedBalance;
            try
            {
                transaction.Status = TransactionStatus.Completed;
                transaction.Note = "Transaction completed successfully.";
                fromAccount.LockedBalance = fromAccountLockedBalance - transactionAmount;
                toAccount.Balance = toAccountBalance + transactionAmount;
                await unitOfWork.AccountRepository.UpdateAsync(toAccount);
                await unitOfWork.AccountRepository.UpdateAsync(fromAccount);
                context.Update(transaction);
                await unitOfWork.CompleteAsync();
                eventData.Type = EventTypes.TransactionCompleted;
                eventData.Message = "Transaction completed successfully.";
            }
            catch (Exception ex)
            {
                transaction.Status = TransactionStatus.Failed;
                transaction.Note = "Internal server error: " + ex.Message;
                fromAccount.Balance = fromAccountBalance + transactionAmount;
                fromAccount.LockedBalance = fromAccountLockedBalance - transactionAmount;
                toAccount.Balance = toAccountBalance;

                await unitOfWork.AccountRepository.UpdateAsync(toAccount);
                await unitOfWork.AccountRepository.UpdateAsync(fromAccount);
                await unitOfWork.TransactionRepository.UpdateAsync(transaction);
                await unitOfWork.CompleteAsync();
                eventData.Type = EventTypes.TransactionFailed;
                eventData.Message = "Transaction failed.";
            }
            
            eventData.Data = new TransactionMessage
            {
                TransactionId = transaction.TransactionId,
                FromAccountId = transaction.FromAccountId,
                ToAccountId = transaction.ToAccountId,
                Amount = transaction.Amount,
                FromAccount = new AccountDto
                {
                    AccountId = transaction.FromAccount!.AccountId,
                    AccountNumber = transaction.FromAccount.AccountNumber,
                    FullName = transaction.FromAccount.User.FullName,
                    Email = transaction.FromAccount.User.Email ?? string.Empty
                },
                ToAccount = new AccountDto
                {
                    AccountId = transaction.ToAccount!.AccountId,
                    AccountNumber = transaction.ToAccount.AccountNumber,
                    FullName = transaction.ToAccount.User.FullName,
                    Email = transaction.ToAccount.User.Email ?? string.Empty
                },
                Status = transaction.Status,
                Note = transaction.Note,
                TransactionTime = transaction.TransactionTime,
            };
            await webSocketService.SendToAllAsync("event", eventData);

            Console.WriteLine($"Transaction completed: {transaction.TransactionId}");
            return eventData.Type == EventTypes.TransactionCompleted;
        }
    }
}