using Banking.Api.Filters;
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
        [AllowAnonymous]
        [HttpPost("SendToAll")]
        public async Task<IActionResult> SendToAll([FromBody] EventData data)
        {
            await webSocketService.SendToAllAsync("Event", JsonConvert.SerializeObject(data));
            return Ok(connectionMapper);
        }
    }
}