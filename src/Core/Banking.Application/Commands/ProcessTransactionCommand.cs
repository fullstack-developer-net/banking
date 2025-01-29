using Banking.Domain.Constants;
using Banking.Domain.Entities;
using Banking.Domain.Interfaces;
using MediatR;

namespace Banking.Application.Commands
{
    public record ProcessTransactionCommand(string TransactionId) : IRequest<bool>;
    public class ProcessTransactionCommandHandler(IUnitOfWork unitOfWork) : IRequestHandler<ProcessTransactionCommand, bool>
    {
        public async Task<bool> Handle(ProcessTransactionCommand request, CancellationToken cancellationToken)
        {
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
