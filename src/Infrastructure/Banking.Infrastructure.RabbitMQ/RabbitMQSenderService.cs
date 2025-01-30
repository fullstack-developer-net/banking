using Banking.Core.Interfaces.Services;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System.Text;

namespace Banking.Infrastructure.MessageQueue
{
    public class RabbitMQSenderService(ILogger<RabbitMQSenderService> logger, IConnectionFactory factory) : ISenderService
    {

        public async Task SendMessageAsync(string queueName, object message)
        {
            var connection = await factory.CreateConnectionAsync();
            var channel = await connection.CreateChannelAsync();
            await channel.QueueDeclareAsync(queue: queueName,
                                   durable: false,
                                   exclusive: false,
                                   autoDelete: false,
                                   arguments: null);

            var body = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(message));

            await channel.BasicPublishAsync("", queueName, body, CancellationToken.None);

            logger.LogInformation($"Sent message: {message}");

        }

    }
}
