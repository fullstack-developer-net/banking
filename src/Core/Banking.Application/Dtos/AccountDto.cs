namespace Banking.Application.Dtos
{
    public class AccountDto : UserDto
    {
        public long? AccountId { get; set; }
        public decimal Balance { get; set; }
        public bool IsActive { get; set; }
        public string AccountNumber { get; set; }
    }
}
