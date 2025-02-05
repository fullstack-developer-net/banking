﻿using Banking.Application.Dtos;
using Banking.Common.Helpers;
using Banking.Core.Entities;
using Banking.Core.Entities.Identity;
using Banking.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Banking.Application.Requests.Commands
{
    public record CreateAccountCommand(CreateAccountRequest AccountDto) : IRequest<CreateAccountResponse>;

    public class CreateAccountCommandHandler(IUnitOfWork unitOfWork, UserManager<User> userManager) : IRequestHandler<CreateAccountCommand, CreateAccountResponse>
    {
        public async Task<CreateAccountResponse> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
        {
            var password = $"P@ssw0rd{DateTime.UtcNow.Second}{CommonHelper.RandomString(6)}";

            var user = new User
            {
                UserName = request.AccountDto.Email,
                Email = request.AccountDto.Email,
                FullName = request.AccountDto.FullName,
                TemporaryPassword = password,
                IsActive = true,

            };

            var result = await userManager.CreateAsync(user, password);
            await userManager.AddToRoleAsync(user, "User");

            if (!result.Succeeded)
            {
                throw new Exception("Failed to create user.");
            }

            await unitOfWork.AccountRepository.AddAsync(new Account
            {
                Balance = request.AccountDto.InitialBalance ?? 0,
                UserId = user.Id,
                IsActive = true,

            });

            await unitOfWork.CompleteAsync();

            var account = await unitOfWork.AccountRepository
                .AsQueryable()
                .FirstOrDefaultAsync(a => a.UserId == user.Id, cancellationToken: cancellationToken);

            account.AccountNumber = CommonHelper.GenerateAccountNumber(account.AccountId);

            await unitOfWork.AccountRepository.UpdateAsync(account);
            await unitOfWork.CompleteAsync();
            return new CreateAccountResponse
            {
                Password = password,
                Email = user.Email,
                FullName = user.FullName,
                InitialBalance = account?.Balance,
                UserId = user.Id,
                AccountNumber = account?.AccountNumber,
            };
        }
    }
}