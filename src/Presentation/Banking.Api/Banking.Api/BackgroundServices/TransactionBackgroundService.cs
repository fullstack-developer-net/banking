using Banking.Application.Dtos;
using Banking.Application.Requests.Commands;
using Banking.Common.Constants;
using Banking.Infrastructure.MessageQueue;
using MediatR;
using Newtonsoft.Json;
using RabbitMQ.Client;

namespace Banking.Api.BackgroundServices
{
    public class TransactionBackgroundService : RabbitMqListenerService
    {
        private readonly IMediator _mediator;

        public TransactionBackgroundService(IMediator mediator, IConnectionFactory factory) : base(factory)
        {

            QueueName = QueueNames.Transaction;
            _mediator = mediator;
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
                await _mediator.Send(new ProcessBatchTransactionCommand(data.TransactionId));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                // Log the exception
                // Todo: Add another logic for processing the message
                return;
            }

        }
    }
}
