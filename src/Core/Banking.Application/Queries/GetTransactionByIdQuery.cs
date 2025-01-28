using Banking.Application.Dtos;
using Banking.Domain.Interfaces;
using MediatR;

namespace Banking.Application.Queries
{
    public record GetTransactionByIdQuery(string Id) : IRequest<TransactionDto?>;
    public class GetTransactionByIdQueryHandler(IUnitOfWork unitOfWork) : IRequestHandler<GetTransactionByIdQuery, TransactionDto?>
    {
        public async Task<TransactionDto?> Handle(GetTransactionByIdQuery request, CancellationToken cancellationToken)
        {
            var transaction = await unitOfWork.TransactionRepository.GetByIdAsync(request.Id);

            if (transaction == null) return null;

            return new TransactionDto
            {
                Id = transaction.TransactionId,
                FromAccountId = transaction.FromAccountId,
                ToAccountId = transaction.ToAccountId,
                Amount = transaction.Amount,
                TransactionDate = transaction.TransactionTime
            };
        }
    }
}