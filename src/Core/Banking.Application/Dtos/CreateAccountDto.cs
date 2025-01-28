namespace Banking.Application.Dtos
{
    public class CreateAccountRequest : CreateUserDto
    {
        public decimal? InitialBalance { get; set; }
    }
    public class CreateAccountResponse : UserDto
    {
        public decimal? InitialBalance { get; set; }
        public string? AccountNumber { get; set; }
    }
}
