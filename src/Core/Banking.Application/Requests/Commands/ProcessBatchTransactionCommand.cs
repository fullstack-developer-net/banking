using Banking.Application.Constants;
using Banking.Application.Dtos;
using Banking.Common.Constants;
using Banking.Core.Interfaces;
using Banking.Core.Interfaces.Services;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace Banking.Application.Requests.Commands
{
    public record ProcessBatchTransactionCommand(string TransactionId) : IRequest<bool>;

    public class ProcessBatchTransactionCommandHandler(
        IServiceProvider serviceProvider ) : IRequestHandler<ProcessBatchTransactionCommand, bool>
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
            var transaction = await unitOfWork.TransactionRepository.GetByIdAsync(request.TransactionId);
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
                await unitOfWork.TransactionRepository.UpdateAsync(transaction);
                await unitOfWork.CompleteAsync();
                eventData.Type = EventTypes.TransactionCompleted;
                eventData.Message = "Transaction completed successfully.";
                eventData.Data = transaction;
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
                eventData.Data = transaction;
            }

            await webSocketService.SendToAllAsync("event", JsonConvert.SerializeObject(eventData));
            
            Console.WriteLine($"Transaction completed: {transaction.TransactionId}");
            return eventData.Type == EventTypes.TransactionCompleted;
        }
    }
}