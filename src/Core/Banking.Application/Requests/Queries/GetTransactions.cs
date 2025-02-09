using Banking.Application.Dtos;
using Banking.Core.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Banking.Application.Requests.Queries
{
    public record GetTransactions(int PageNumber = 1, int PageSize = 10, string? SearchTerm = null)
    : IRequest<PaginatedResult<TransactionMessage>>;

    public class GetTransactionsQueryHandler(IUnitOfWork unitOfWork)
        : IRequestHandler<GetTransactions, PaginatedResult<TransactionMessage>>
    {
        public async Task<PaginatedResult<TransactionMessage>> Handle(GetTransactions request, CancellationToken cancellationToken)
        {
            var query = unitOfWork.TransactionRepository.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                query = query.Where(a => 
                    a.TransactionId.Contains(request.SearchTerm) ||
                    a.FromAccountId.Equals(request.SearchTerm) ||
                    a.ToAccountId.Equals(request.SearchTerm));
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var transactions = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(a => new TransactionMessage
                {
                    TransactionId = a.TransactionId,
                    FromAccountId = a.FromAccountId,
                    ToAccountId = a.ToAccountId,
                    Amount = a.Amount,
                    Status = a.Status,
                    Note = a.Note,
                    TransactionTime = a.TransactionTime,
                })
                .ToListAsync(cancellationToken);

            return new PaginatedResult<TransactionMessage>(
                transactions,
                totalCount,
                request.PageNumber,
                request.PageSize);
        }
    }
}