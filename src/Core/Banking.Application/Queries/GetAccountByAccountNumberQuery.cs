using Banking.Application.Dtos;
using Banking.Core.Interfaces;
using MediatR;

namespace Banking.Application.Queries
{
    public record GetAccountByAccountNumberQuery(long AccountId) : IRequest<AccountDto?>;
    public class GetAccountByAccountNumberQueryHandler(IUnitOfWork unitOfWork) : IRequestHandler<GetAccountByAccountNumberQuery, AccountDto?>
    {
        public async Task<AccountDto?> Handle(GetAccountByAccountNumberQuery request, CancellationToken cancellationToken)
        {
            var account = await unitOfWork.AccountRepository.GetByIdAsync(request.AccountId);

            if (account == null) return null;

            return new AccountDto
            {
                FullName = account.User.FullName,
                Email = account.User.Email ?? string.Empty,
                IsActive = account.IsActive,
                Balance = account.Balance,
                UserId = account.UserId,
            };
        }
    }
}
