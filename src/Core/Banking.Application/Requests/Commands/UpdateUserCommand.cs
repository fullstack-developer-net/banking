using Banking.Application.Dtos;
using Banking.Core.Entities.Identity;
using Banking.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Banking.Application.Requests.Commands
{
    public record UpdateUserCommand(UpdateUserDto UpdateUserDto) : IRequest<Unit>;

    public class UpdateUserCommandHandler(IUnitOfWork unitOfWork, UserManager<User> userManager)
        : IRequestHandler<UpdateUserCommand, Unit>
    {
        public async Task<Unit> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByIdAsync(request.UpdateUserDto.UserId) ?? throw new Exception("User not found");

        
            user.FullName = request.UpdateUserDto.FullName;
            await userManager.SetEmailAsync(user, request.UpdateUserDto.Email);

            var result = await userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                throw new Exception("Failed to update user.");
            }

            return Unit.Value;
        }
    }
}
