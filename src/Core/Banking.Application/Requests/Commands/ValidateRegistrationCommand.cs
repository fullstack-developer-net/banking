using Banking.Core.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Banking.Application.Requests.Commands
{
    public record ValidateRegistrationCommand(string UserName, string Email) : IRequest<List<string>>;

    public class CheckAccountCommandHandler(UserManager<User> userManager) : IRequestHandler<ValidateRegistrationCommand, List<string>>
    {
        public async Task<List<string>> Handle(ValidateRegistrationCommand request, CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            if (string.IsNullOrEmpty(request.UserName)) errors.Add("Username is required.");
            else if (await userManager.FindByNameAsync(request.UserName) != null) errors.Add("Username is already taken.");

            if (string.IsNullOrEmpty(request.Email)) errors.Add("Email is required.");
            else if (await userManager.FindByEmailAsync(request.Email) != null) errors.Add("Email is already taken.");

            return errors;
        }
    }
}
