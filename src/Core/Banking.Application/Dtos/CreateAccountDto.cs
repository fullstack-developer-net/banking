namespace Banking.Application.Dtos
{
    public class CreateAccountRequest : CreateUserDto
    {
        public bool IsAdmin { get; set; } 
        public decimal? InitialBalance { get; set; }
    }
    public class CreateAccountResponse : UserDto
    {
        public decimal? InitialBalance { get; set; }
        public string? AccountNumber { get; set; }
    }
}
