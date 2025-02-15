using Banking.Application.Dtos;
using Banking.Core.Interfaces;
using Banking.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Banking.Application.Requests.Queries
{
    public record GetAccountById(long AccountId) : IRequest<AccountDto?>;
    public class GetAccountByIdQueryHandler(BankingDbContext context) : IRequestHandler<GetAccountById, AccountDto?>
    {
        public async Task<AccountDto?> Handle(GetAccountById request, CancellationToken cancellationToken)
        {
            var account = await  context.Accounts
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.AccountId == request.AccountId, cancellationToken);
            if (account == null) return null;

            return new AccountDto
            {
                FullName = account.User.FullName,
                Email = account.User.Email ?? string.Empty,
                IsActive = account.IsActive,
                Balance = account.Balance,
                UserId = account.UserId,
                AccountNumber = account.AccountNumber,
                AccountId = account.AccountId,
            };
        }
    }
}
