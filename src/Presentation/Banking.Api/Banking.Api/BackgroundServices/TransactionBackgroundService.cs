using Banking.Application.Dtos;
using Banking.Domain.Constants;
using Banking.Domain.Interfaces;
using Banking.Infrastructure.RabbitMQ;
using Newtonsoft.Json;
using RabbitMQ.Client;

namespace Banking.Api.BackgroundServices
{
    public class TransactionBackgroundService : RabbitMQListenerService
    {
        private readonly IServiceProvider serviceProvider;

        public TransactionBackgroundService(IServiceProvider serviceProvider, IConnectionFactory factory) : base(factory)
        {

            queueName = QueueNames.TransactionQueue;
            this.serviceProvider = serviceProvider;
        }

 
        protected override async Task HandleMessageAsync(string content)
        {
            using var scope = serviceProvider.CreateScope();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            try
            {
                var data = JsonConvert.DeserializeObject<TransactionMessage>(content);
                if (data == null)
                {
                    return;
                }
                // Add your business logic for processing the message here.mediator
                var transaction = await unitOfWork.TransactionRepository.GetByIdAsync(data.TransactionId);


                if (transaction == null)
                {
                    return;
                }

                try
                {
                    var fromAccount = await unitOfWork.AccountRepository.GetByIdAsync(transaction.FromAccountId);
                    var toAccount = await unitOfWork.AccountRepository.GetByIdAsync(transaction.ToAccountId);

                    if (fromAccount == null)
                    {
                        transaction.Status = TransactionStatus.Failed;
                        transaction.Note = "Invalid sender account";
                    }
                    else if (toAccount == null)
                    {
                        transaction.Status = TransactionStatus.Failed;
                        transaction.Note = "Invalid receiver account";
                    }
                    else if (fromAccount.Balance < transaction.Amount)
                    {
                        transaction.Status = TransactionStatus.Failed;
                        transaction.Note = "Insufficient funds.";
                    }
                    else
                    {
                        fromAccount.Balance -= transaction.Amount;
                        toAccount.Balance += transaction.Amount;
                        transaction.Status = TransactionStatus.Completed;
                        transaction.Note = "Transaction completed successfully.";
                        await unitOfWork.AccountRepository.UpdateAsync(toAccount);
                        await unitOfWork.AccountRepository.UpdateAsync(fromAccount);
                    }

                    // Initialize the transaction and store into the database
                    await unitOfWork.TransactionRepository.UpdateAsync(transaction);
                }
                catch (Exception ex)
                {
                    transaction.Status = TransactionStatus.Failed;
                    transaction.Note = "Internal server error: " + ex.Message;
                }
                await unitOfWork.CompleteAsync();
            }
            catch (Exception ex)
            {

                return;
            }

        }
    }
}
