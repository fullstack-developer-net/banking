using Banking.Application.Dtos;
using Banking.Core;
using Banking.Core.Interfaces;
using Banking.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Banking.Application.Requests.Queries
{
    public record GetTransactions(int PageNumber = 1, int PageSize = 10, string? SearchTerm = null)
        : IRequest<PaginatedResult<TransactionMessage>>;

    public class GetTransactionsQueryHandler(
        IUnitOfWork unitOfWork,
        CurrentLoginUser loginUser,
        BankingDbContext context)
        : IRequestHandler<GetTransactions, PaginatedResult<TransactionMessage>>
    {
        public async Task<PaginatedResult<TransactionMessage>> Handle(GetTransactions request,
            CancellationToken cancellationToken)
        {
            var searchTerm = request.SearchTerm?.Trim().ToLower()??string.Empty;
         
            var isAdmin = loginUser.Roles?.Contains("Admin")??false;
            var query = context.Transactions
                .Include(x => x.FromAccount).ThenInclude(a => a!.User)
                .Include(x => x.ToAccount).ThenInclude(a => a!.User)
                .Where(x => isAdmin || x.FromAccountId == loginUser.Account!.AccountId ||
                            x.ToAccountId == loginUser.Account!.AccountId);

            // Apply filters
            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                if (isAdmin)
                {
                    query = query.Where(a =>
                        a.FromAccount!.User.FullName.ToLower().Contains(searchTerm) ||
                        a.FromAccount!.User.FullName.ToLower().Contains(searchTerm));
                }
                else
                {
                    query = query.Where(a =>
                         a.ToAccount!.User.FullName.ToLower().Contains(searchTerm));
                }
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var transactions = await query
                .OrderByDescending(x => x.ModifiedAt)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(a => new TransactionMessage
                {
                    FromAccount = new AccountDto
                    { 
                        AccountId = a.FromAccount!.AccountId,
                        AccountNumber = a.FromAccount.AccountNumber,
                        Email = a.FromAccount.User.Email ?? string.Empty,
                        FullName = a.FromAccount.User.FullName
                    },
                    ToAccount = new AccountDto
                    {
                        AccountId = a.ToAccount!.AccountId,
                        AccountNumber = a.ToAccount.AccountNumber,
                        Email = a.ToAccount!.User.Email ?? string.Empty,
                        FullName = a.ToAccount.User.FullName
                    },
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