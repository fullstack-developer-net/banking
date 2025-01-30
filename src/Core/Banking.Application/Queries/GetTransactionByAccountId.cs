using Banking.Application.Dtos;
using Banking.Core.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Banking.Application.Queries
{
    public record GetTransactionsByAccountIdQuery(int AccountId) : IRequest<IEnumerable<TransactionMessage>>;
    public class GetTransactionsByAccountIdQueryHandler(IUnitOfWork unitOfWork) : IRequestHandler<GetTransactionsByAccountIdQuery, IEnumerable<TransactionMessage>>
    {
        public async Task<IEnumerable<TransactionMessage>> Handle(GetTransactionsByAccountIdQuery request, CancellationToken cancellationToken)
        {
            var allTransactions = await unitOfWork.TransactionRepository.AsQueryable()
                .Where(x => x.FromAccountId == request.AccountId || x.ToAccountId == request.AccountId)
              .Select(t => new TransactionMessage
              {
                  TransactionId = t.TransactionId,
                  FromAccountId = t.FromAccountId,
                  ToAccountId = t.ToAccountId,
                  Amount = t.Amount,
                  TransactionTime = t.TransactionTime
              }).ToListAsync(cancellationToken: cancellationToken);

            return allTransactions;
        }
    }
}
