namespace Banking.Application.Dtos
{
    public class AccountDto:UserDto
    {
        public string AccountNumber { get; set; }
        public decimal Balance { get; set; }
        public bool IsActive { get; set; }
    }
}
