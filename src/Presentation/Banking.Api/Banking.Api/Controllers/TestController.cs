using Banking.Application.Dtos;
using Banking.Core.Interfaces.Services;
using Banking.Infrastructure.WebSocket;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Banking.Api.Controllers
{
    public class TestWebsocketController(
        IWebSocketService webSocketService,
        IConnectionMapper connectionMapper
    ) : BaseApiController
    {
        [HttpPost("SendToAll")]
        public async Task<IActionResult> SendToAll([FromBody] EventData data)
        {
            await webSocketService.SendToAllAsync("receiveMessage", JsonConvert.SerializeObject(data));
            return Ok(connectionMapper);
        }
        
        [HttpPost("websocket-SendToUserAsync")]
        public async Task<IActionResult> SendToUserAsync([FromBody] EventData data)
        {
            await webSocketService.SendToUserAsync("userId123", "SendToUser",JsonConvert.SerializeObject(data));
            return Ok(connectionMapper);
        }
   
    }
}