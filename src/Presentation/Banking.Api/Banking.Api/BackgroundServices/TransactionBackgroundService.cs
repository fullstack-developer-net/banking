using Banking.Application.Commands;
using Banking.Application.Constants;
using Banking.Application.Dtos;
using Banking.Application.Queries;
using Banking.Common.Constants;
using Banking.Infrastructure.MessageQueue;
using MediatR;
using Newtonsoft.Json;
using RabbitMQ.Client;

namespace Banking.Api.BackgroundServices
{
    public class TransactionBackgroundService : RabbitMQListenerService
    {
        private readonly IMediator mediator;

        public TransactionBackgroundService(IMediator mediator, IConnectionFactory factory) : base(factory)
        {

            queueName = QueueNames.Transaction;
            this.mediator = mediator;
        }


        protected override async Task HandleMessageAsync(string content)
        {

            try
            {
                var data = JsonConvert.DeserializeObject<TransactionMessage>(content);
                if (data == null)
                {
                    return;
                }
                // Skip validation for now
                var result = await mediator.Send(new ProcessBatchTransactionCommand(data.TransactionId));
                var fromUser = await mediator.Send(new GetUserByAccountIdQuery(data.FromAccountId));
                var toUser = await mediator.Send(new GetUserByAccountIdQuery(data.ToAccountId));

                var eventData = new EventData
                {
                    Type = EventTypes.TransactionUpdated,
                    UserId = fromUser.Id,
                    Message = "Transaction processed successfully",
                    CreatedAt = DateTime.UtcNow,
                };

                // Send notification to the sender
                await mediator.Send(new SendEventCommand(eventData));

                // Send notification to the receiver
                eventData.UserId = toUser.Id;
                await mediator.Send(new SendEventCommand(eventData));

            }
            catch (Exception ex)
            {
                // Log the exception
                // Todo: Add another logic for processing the message
                return;
            }

        }
    }
}
