using Banking.Application.Dtos;
using Banking.Domain.Constants;
using Banking.Domain.Entities;
using Banking.Domain.Interfaces;
using Banking.Domain.Interfaces.Services;
using MediatR;

namespace Banking.Application.Commands
{
    public record CreateTransactionCommand(long FromAccountId, long ToAccountId, decimal Amount) : IRequest<TransactionMessage>;
    public class CreateTransactionCommandHandler(IUnitOfWork unitOfWork, ISenderService sender) : IRequestHandler<CreateTransactionCommand, TransactionMessage>
    {
        public async Task<TransactionMessage> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
        {

            var fromAccount = await unitOfWork.AccountRepository.GetByIdAsync(request.FromAccountId);
            var toAccount = await unitOfWork.AccountRepository.GetByIdAsync(request.ToAccountId);

            if (fromAccount == null || toAccount == null)
            {
                throw new Exception("Invalid account(s) supplied.");
            }

            if (fromAccount.Balance < request.Amount)
            {
                throw new Exception("Insufficient funds.");
            }


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
            await unitOfWork.TransactionRepository.AddAsync(transaction);
            await unitOfWork.CompleteAsync();

            var message = new TransactionMessage
            {
                TransactionId = transaction.TransactionId,
                FromAccountId = transaction.FromAccountId,
                ToAccountId = transaction.ToAccountId,
                Amount = transaction.Amount,
                Status = transaction.Status,
                Note = transaction.Note,
                TransactionTime = transaction.TransactionTime,
            };

            // Send the transaction request to the queue
            await sender.SendMessageAsync(message);
            return message;

        }
    }
}
