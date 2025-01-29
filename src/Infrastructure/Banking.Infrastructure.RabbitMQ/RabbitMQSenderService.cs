using Banking.Domain.Constants;
using Banking.Domain.Interfaces.Services;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System.Text;

namespace Banking.Infrastructure.RabbitMQ
{
    public class RabbitMQSenderService(ILogger<RabbitMQSenderService> logger, IConnectionFactory factory) : ISenderService
    {

        public async Task SendMessageAsync(object message)
        {
            var connection = await factory.CreateConnectionAsync();
            var channel = await connection.CreateChannelAsync();
            await channel.QueueDeclareAsync(queue: QueueNames.TransactionQueue,
                                   durable: false,
                                   exclusive: false,
                                   autoDelete: false,
                                   arguments: null);

            var body = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(message));

            await channel.BasicPublishAsync("", QueueNames.TransactionQueue, body, CancellationToken.None);

            logger.LogInformation($"Sent message: {message}");

        }

    }
}
