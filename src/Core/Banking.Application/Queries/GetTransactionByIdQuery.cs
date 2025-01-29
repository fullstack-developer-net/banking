using Banking.Application.Dtos;
using Banking.Domain.Interfaces;
using MediatR;

namespace Banking.Application.Queries
{
    public record GetTransactionByIdQuery(string Id) : IRequest<TransactionMessage?>;
    public class GetTransactionByIdQueryHandler(IUnitOfWork unitOfWork) : IRequestHandler<GetTransactionByIdQuery, TransactionMessage?>
    {
        public async Task<TransactionMessage?> Handle(GetTransactionByIdQuery request, CancellationToken cancellationToken)
        {
            var transaction = await unitOfWork.TransactionRepository.GetByIdAsync(request.Id);

            if (transaction == null) return null;

            return new TransactionMessage
            {
                TransactionId = transaction.TransactionId,
                FromAccountId = transaction.FromAccountId,
                ToAccountId = transaction.ToAccountId,
                Amount = transaction.Amount,
                TransactionTime = transaction.TransactionTime
            };
        }
    }
}