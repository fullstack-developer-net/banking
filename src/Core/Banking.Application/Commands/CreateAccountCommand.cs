﻿using Banking.Application.Dtos;
using Banking.Domain.Entities;
using Banking.Domain.Entities.Identity;
using Banking.Domain.Helpers;
using Banking.Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Banking.Application.Commands
{
    public record CreateAccountCommand(CreateAccountRequest AccountDto) : IRequest<CreateAccountResponse>;

    public class CreateAccountCommandHandler(IUnitOfWork unitOfWork, UserManager<User> userManager) : IRequestHandler<CreateAccountCommand, CreateAccountResponse>
    {
        public async Task<CreateAccountResponse> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
        {
            var password = CommonHelper.RandomString(6);
            var user = new User
            {
                UserName = request.AccountDto.Email,
                Email = request.AccountDto.Email,
                FullName = request.AccountDto.FullName,
                IsActive = true,
            };

            var result = await userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                throw new Exception("Failed to create user");
            }

            await unitOfWork.AccountRepository.AddAsync(new Account
            {
                Balance = request.AccountDto.InitialBalance ?? 0,
                UserId = user.Id,
                IsActive = true,
            });

            await unitOfWork.CompleteAsync();

            var account = await unitOfWork.AccountRepository.GetAccountByUserIdAsync(user.Id);
 
            return new CreateAccountResponse
            {
                AccountNumber = account?.AccountNumber,
                Password = password,
                Email = user.Email,
                FullName = user.FullName,
                InitialBalance = account?.Balance,
             };
        }
    }
}