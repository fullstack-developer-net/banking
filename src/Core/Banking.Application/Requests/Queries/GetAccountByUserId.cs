using Banking.Application.Dtos;
using Banking.Core.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Banking.Application.Requests.Queries
{
    public record GetAccountByUserId(string UserId) : IRequest<AccountDto?>;
    public class GetAccountByUserIdQueryHandler(IUnitOfWork unitOfWork) : IRequestHandler<GetAccountByUserId, AccountDto?>
    {
        public async Task<AccountDto?> Handle(GetAccountByUserId request, CancellationToken cancellationToken)
        {
            var account = await unitOfWork.AccountRepository.AsQueryable().FirstOrDefaultAsync(x => x.UserId == request.UserId, cancellationToken: cancellationToken);

            if (account == null) return null;
            var user =await unitOfWork.UserRepository.AsQueryable().FirstOrDefaultAsync(x => x.Id == account.UserId,cancellationToken);
            return new AccountDto
            {
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                IsActive = account.IsActive,
                Balance = account.Balance,
                UserId = account.UserId,
                AccountNumber = account.AccountNumber,
                AccountId = account.AccountId,
            };
        }
    }
}
