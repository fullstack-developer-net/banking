using Banking.Api.Filters;
using Banking.Application.Dtos;
using Banking.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Banking.Api.Controllers
{
    public class TestWebsocketController(
        IWebSocketService webSocketService) : BaseApiController
    {
        [AllowAnonymous]
        [HttpPost("SendToAll")]
        public async Task<IActionResult> SendToAll([FromQuery] string eventType, [FromBody] EventData data)
        {
            await webSocketService.SendToAllAsync(eventType, JsonConvert.SerializeObject(data));
            return Ok();
        }
    }
}