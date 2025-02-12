namespace Banking.Application.Dtos
{
    public class AccountDto  
    {
        public long? AccountId { get; set; }
        public decimal? Balance { get; set; }
        public string? AccountNumber { get; set; }
        public string? UserId { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public bool? IsActive { get; set; }
        public string? Password { get; set; }
    }
}
