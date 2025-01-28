using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace Banking.Api.Controllers
{
    //[Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Route("api/v1/[controller]")]
    [ApiVersion("1.0")]
    public class BaseBankingController : ODataController
    {
    }
}
