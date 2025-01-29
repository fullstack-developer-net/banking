namespace Banking.Domain.Interfaces.Services
{
    public interface ISenderService
    {
        Task SendMessageAsync(object message);
    }
}
