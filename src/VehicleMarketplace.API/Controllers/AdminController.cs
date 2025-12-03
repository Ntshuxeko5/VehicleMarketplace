using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VehicleMarketplace.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        [HttpPost("approve-listing/{id}")]
        public IActionResult ApproveListing(Guid id)
        {
            // TODO: Implement ApproveListingCommand
            return Ok();
        }

        [HttpPost("reject-listing/{id}")]
        public IActionResult RejectListing(Guid id)
        {
            // TODO: Implement RejectListingCommand
            return Ok();
        }
    }
}
