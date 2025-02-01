using Banking.Application.Dtos;
using Banking.Core.Interfaces.Services;
using Banking.Infrastructure.WebSocket;
using MediatR;

namespace Banking.Application.Requests.Commands
{
    public record SendEventCommand(EventData Data) : IRequest;

    public class SendEventCommandHandler(IWebSocketService webSocket, IConnectionMapper connectionMapper) : IRequestHandler<SendEventCommand>
    {
        public async Task Handle(SendEventCommand request, CancellationToken cancellationToken)
        {
            //   var connections = connectionMapper.GetConnections(request.Data.UserId);
            await webSocket.SendToUserAsync(request.Data.UserId, "notification", request.Data);
            //       await webSocket.SendAsync($"{QueueNames.Notification}_{request.Data.Type}_{request.Data.UserId}", request.Data);
        }
    }
}
