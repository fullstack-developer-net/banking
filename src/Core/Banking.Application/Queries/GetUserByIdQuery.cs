using Banking.Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Banking.Application.Queries
{
    public record GetUserByIdQuery(string UserId) : IRequest<User>;

    public class GetUserByIdQueryHandler(SignInManager<User> signInManager) : IRequestHandler<GetUserByIdQuery, User>
    {
        public async Task<User> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            return await signInManager.UserManager.FindByIdAsync(request.UserId) ?? throw new Exception("User not found");
        }
    }
}
