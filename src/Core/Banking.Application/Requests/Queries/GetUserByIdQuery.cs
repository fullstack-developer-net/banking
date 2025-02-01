using Banking.Core.Entities.Identity;
using Banking.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Banking.Application.Requests.Queries
{
    public record GetUserByAccountIdQuery(long AccountId) : IRequest<User>;

    public class GetUserByAccountIdQueryHandler(SignInManager<User> signInManager, IUnitOfWork unitOfWork) : IRequestHandler<GetUserByAccountIdQuery, User>
    {
        public async Task<User> Handle(GetUserByAccountIdQuery request, CancellationToken cancellationToken)
        {
            var account = await unitOfWork.AccountRepository.GetByIdAsync(request.AccountId) ?? throw new Exception("Account not found");
            return await signInManager.UserManager.FindByIdAsync(account.UserId) ?? throw new Exception("User not found");
        }
    }
}
