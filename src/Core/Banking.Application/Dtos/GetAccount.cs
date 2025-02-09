namespace Banking.Application.Dtos
{
    public class GetAccountsRequest : CreateUserDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
        public bool? IsActive { get; set; }
    }
}
