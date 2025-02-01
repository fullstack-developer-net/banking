using Banking.Common.Constants;
using Banking.Core.Entities;
using Banking.Core.Interfaces;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Banking.Application.Requests.Commands
{
    public record ProcessBatchTransactionCommand(string TransactionId) : IRequest<bool>;
    public class ProcessBatchTransactionCommandHandler(IServiceProvider serviceProvider) : IRequestHandler<ProcessBatchTransactionCommand, bool>
    {
        public async Task<bool> Handle(ProcessBatchTransactionCommand request, CancellationToken cancellationToken)
        {
            using var scope = serviceProvider.CreateScope();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            Transaction transaction = await unitOfWork.TransactionRepository.GetByIdAsync(request.TransactionId);

            if (transaction == null)
            {
                return false;
            }

            try
            {
                var fromAccount = await unitOfWork.AccountRepository.GetByIdAsync(transaction.FromAccountId);
                var toAccount = await unitOfWork.AccountRepository.GetByIdAsync(transaction.ToAccountId);

                if (fromAccount == null)
                {
                    transaction.Status = TransactionStatus.Failed;
                    transaction.Note = "Invalid sender account";
                    return false;
                }
                if (toAccount == null)
                {
                    transaction.Status = TransactionStatus.Failed;
                    transaction.Note = "Invalid receiver account";
                    return false;
                }
                if (fromAccount.Balance < transaction.Amount)
                {
                    transaction.Status = TransactionStatus.Failed;
                    transaction.Note = "Insufficient funds.";
                }

                fromAccount.Balance -= transaction.Amount;
                toAccount.Balance += transaction.Amount;
                transaction.Status = TransactionStatus.Completed;
                transaction.Note = "Transaction completed successfully.";


                // Initialize the transaction and store into the database
                await unitOfWork.TransactionRepository.UpdateAsync(transaction);
                await unitOfWork.AccountRepository.UpdateAsync(toAccount);
                await unitOfWork.AccountRepository.UpdateAsync(fromAccount);
                await unitOfWork.CompleteAsync();
            }
            catch (Exception ex)
            {
                transaction.Status = TransactionStatus.Failed;
                transaction.Note = "Internal server error: " + ex.Message;
                return false;
            }

            return true;

        }
    }
}
