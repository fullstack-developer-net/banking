namespace Banking.Core.Interfaces.Services
{
    public interface ISenderService
    {
        Task SendMessageAsync(string queueName, object message);
    }
}
