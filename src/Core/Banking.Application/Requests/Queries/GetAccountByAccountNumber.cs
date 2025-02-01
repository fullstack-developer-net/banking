using Banking.Application.Dtos;
using Banking.Core.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Banking.Application.Requests.Queries
{
    public record GetAccountByAccountNumber(string AccountNumber) : IRequest<AccountDto?>;
    public class GetAccountByAccountNumberQueryHandler(IUnitOfWork unitOfWork) : IRequestHandler<GetAccountByAccountNumber, AccountDto?>
    {
        public async Task<AccountDto?> Handle(GetAccountByAccountNumber request, CancellationToken cancellationToken)
        {
            var account = await unitOfWork.AccountRepository.AsQueryable().FirstOrDefaultAsync(x => x.AccountNumber == request.AccountNumber, cancellationToken: cancellationToken);

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
