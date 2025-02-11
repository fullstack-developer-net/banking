namespace Banking.Application.Dtos;

public class TransferDto
{
    public long ToAccountId { set; get; }
    public decimal Amount { set; get; }
}