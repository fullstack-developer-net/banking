using Banking.Application.Dtos;
using Banking.Domain.Interfaces;
using MediatR;

namespace Banking.Application.Queries
{
    public record GetTransactionsByAccountIdQuery(int AccountId) : IRequest<IEnumerable<TransactionDto>>;
    public class GetTransactionsByAccountIdQueryHandler(IUnitOfWork unitOfWork) : IRequestHandler<GetTransactionsByAccountIdQuery, IEnumerable<TransactionDto>>
    {
        public async Task<IEnumerable<TransactionDto>> Handle(GetTransactionsByAccountIdQuery request, CancellationToken cancellationToken)
        {
            var sentTransactions = await unitOfWork.TransactionRepository.GetByFromAccountIdAsync(request.AccountId);
            var receivedTransactions = await unitOfWork.TransactionRepository.GetByToAccountIdAsync(request.AccountId);

            var allTransactions = sentTransactions.Concat(receivedTransactions);

            return allTransactions.Select(t => new TransactionDto
            {
                Id = t.TransactionId,
                FromAccountId = t.FromAccountId,
                ToAccountId = t.ToAccountId,
                Amount = t.Amount,
                TransactionDate = t.TransactionTime
            });
        }
    }
}
