using Banking.Application.Dtos;
using Banking.Domain.Interfaces;
using MediatR;

namespace Banking.Application.Queries
{
    public record GetTransactionsByAccountIdQuery(int AccountId) : IRequest<IEnumerable<TransactionMessage>>;
    public class GetTransactionsByAccountIdQueryHandler(IUnitOfWork unitOfWork) : IRequestHandler<GetTransactionsByAccountIdQuery, IEnumerable<TransactionMessage>>
    {
        public async Task<IEnumerable<TransactionMessage>> Handle(GetTransactionsByAccountIdQuery request, CancellationToken cancellationToken)
        {
            var sentTransactions = await unitOfWork.TransactionRepository.GetByFromAccountIdAsync(request.AccountId);
            var receivedTransactions = await unitOfWork.TransactionRepository.GetByToAccountIdAsync(request.AccountId);

            var allTransactions = sentTransactions.Concat(receivedTransactions);

            return allTransactions.Select(t => new TransactionMessage
            {
                TransactionId = t.TransactionId,
                FromAccountId = t.FromAccountId,
                ToAccountId = t.ToAccountId,
                Amount = t.Amount,
                TransactionTime = t.TransactionTime
            });
        }
    }
}
