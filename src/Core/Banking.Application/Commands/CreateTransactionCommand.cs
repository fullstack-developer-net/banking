using Banking.Domain.Entities;
using Banking.Domain.Interfaces;
using MediatR;

namespace Banking.Application.Commands
{
    public record CreateTransactionCommand(long FromAccountId, long ToAccountId, decimal Amount) : IRequest<string>;
    public class CreateTransactionCommandHandler : IRequestHandler<CreateTransactionCommand, string>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateTransactionCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<string> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
        {
            var fromAccount = await _unitOfWork.AccountRepository.GetByIdAsync(request.FromAccountId);
            var toAccount = await _unitOfWork.AccountRepository.GetByIdAsync(request.ToAccountId);

            if (fromAccount == null || toAccount == null)
            {
                throw new Exception("Invalid account(s) supplied.");
            }

            if (fromAccount.Balance < request.Amount)
            {
                throw new Exception("Insufficient funds.");
            }

            // Update balances
            fromAccount.Balance -= request.Amount;
            toAccount.Balance += request.Amount;

            // Create the transaction
            var transaction = new Transaction
            {
                FromAccountId = request.FromAccountId,
                ToAccountId = request.ToAccountId,
                Amount = request.Amount,
                TransactionTime = DateTime.UtcNow,
            };

            await _unitOfWork.TransactionRepository.AddAsync(transaction);
            await _unitOfWork.AccountRepository.UpdateAsync(fromAccount);
            await _unitOfWork.AccountRepository.UpdateAsync(toAccount);
            await _unitOfWork.CompleteAsync();

            return transaction.TransactionId;
        }
    }
}
