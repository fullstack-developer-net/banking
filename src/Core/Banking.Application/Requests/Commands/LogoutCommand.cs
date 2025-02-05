﻿using Banking.Core.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Banking.Application.Requests.Commands
{
    public record LogoutCommand : IRequest;
    public class LogoutCommandHandler(SignInManager<User> signInManager) : IRequestHandler<LogoutCommand>
    {
        public async Task Handle(LogoutCommand request, CancellationToken cancellationToken)
        {
            await signInManager.SignOutAsync();
        }
    }

}
