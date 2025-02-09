using Banking.Application.Dtos;
using Banking.Core.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Banking.Application.Requests.Queries
{
    public record GetAccounts(int PageNumber = 1, int PageSize = 10, string? SearchTerm = null, bool? IsActive = null)
    : IRequest<PaginatedResult<AccountDto>>;

    public class GetAccountsQueryHandler(IUnitOfWork unitOfWork)
        : IRequestHandler<GetAccounts, PaginatedResult<AccountDto>>
    {
        public async Task<PaginatedResult<AccountDto>> Handle(GetAccounts request, CancellationToken cancellationToken)
        {
            var query = unitOfWork.AccountRepository.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                query = query.Where(a =>
                    a.User.FullName.Contains(request.SearchTerm) ||
                    a.User.Email.Contains(request.SearchTerm));
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(a => a.IsActive == request.IsActive.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var accounts = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(a => new AccountDto
                {
                    FullName = a.User.FullName,
                    Email = a.User.Email ?? string.Empty,
                    IsActive = a.IsActive,
                    Balance = a.Balance,
                    UserId = a.UserId,
                    AccountNumber = a.AccountNumber,
                    AccountId = a.AccountId,
                })
                .ToListAsync(cancellationToken);

            return new PaginatedResult<AccountDto>(
                accounts,
                totalCount,
                request.PageNumber,
                request.PageSize);
        }
    }
}