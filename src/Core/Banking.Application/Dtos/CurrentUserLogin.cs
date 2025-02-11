using Banking.Core.Entities;

namespace Banking.Application.Dtos;

public class CurrentUserLogin : AuthenInfo
{
    public Account? Account { get; set; }
}