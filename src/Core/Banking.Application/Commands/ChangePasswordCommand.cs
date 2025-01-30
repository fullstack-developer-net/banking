using Banking.Application.Dtos;
using Banking.Core.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Banking.Application.Commands
{
    public record ChangePasswordCommand(ChangePasswordDto ChangePasswordDto) : IRequest<Unit>;
    public class ChangePasswordCommandHandler(UserManager<User> userManager) : IRequestHandler<ChangePasswordCommand, Unit>
    {
        public async Task<Unit> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByIdAsync(request.ChangePasswordDto.UserId) ?? throw new System.Exception("User not found");
            var result = await userManager.ChangePasswordAsync(user, request.ChangePasswordDto.OldPassword, request.ChangePasswordDto.NewPassword);

            if (!result.Succeeded)
            {
                throw new System.Exception("Failed to change password");
            }
            return Unit.Value;
        }
    }
}
