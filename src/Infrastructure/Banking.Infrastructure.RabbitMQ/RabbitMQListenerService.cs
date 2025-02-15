using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace Banking.Infrastructure.MessageQueue
{
    public abstract class RabbitMqListenerService(IConnectionFactory factory) : BackgroundService
    {

        protected string QueueName = "";
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {

            stoppingToken.ThrowIfCancellationRequested();
            await HandleQueueMessagesAsync(HandleMessageAsync, stoppingToken);
        }

        private async Task HandleQueueMessagesAsync(Func<string, Task>? messageHandler, CancellationToken stoppingToken)
        {
            var connection = await factory.CreateConnectionAsync(stoppingToken);
            var channel = await connection.CreateChannelAsync(cancellationToken: stoppingToken);
            await channel.QueueDeclareAsync(queue: QueueName, durable: false, exclusive: false, autoDelete: false, arguments: null, cancellationToken: stoppingToken);
            var consumer = new AsyncEventingBasicConsumer(channel);

            consumer.ReceivedAsync += async (ch, ea) =>
            {
                var content = Encoding.UTF8.GetString(ea.Body.Span);

                // Handle the received message
                if (messageHandler != null) await messageHandler(content);

                await channel.BasicAckAsync(ea.DeliveryTag, false, stoppingToken);
            };

            await channel.BasicConsumeAsync(QueueName, false, consumer, cancellationToken: stoppingToken);
        }

        protected virtual Task HandleMessageAsync(string content)
        {

            // Add your business logic for processing the message here.
            return Task.CompletedTask;
        }

    }
}
