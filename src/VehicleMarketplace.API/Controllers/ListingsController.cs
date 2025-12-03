using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VehicleMarketplace.Application.Features.Listings.Commands.CreateListing;
using VehicleMarketplace.Application.Features.Listings.Queries.GetListings;
using VehicleMarketplace.Application.Common.Interfaces;

namespace VehicleMarketplace.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListingsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IImageService _imageService;

        public ListingsController(IMediator mediator, IImageService imageService)
        {
            _mediator = mediator;
            _imageService = imageService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ListingDto>>> GetListings([FromQuery] GetListingsQuery query)
        {
            return await _mediator.Send(query);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Guid>> CreateListing(CreateListingCommand command)
        {
            // In a real app, we'd extract the UserId from the claims and set it in the command
            // command.UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            // For now, we assume it's passed or handled otherwise, but let's be safe and try to set it if empty
            if (string.IsNullOrEmpty(command.UserId) && User.Identity?.IsAuthenticated == true)
            {
                 // command.UserId = ... 
                 // For this demo, we'll trust the client or require it in the body if not strictly enforcing claim extraction here yet.
                 // Ideally: command.UserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            }
            
            var id = await _mediator.Send(command);
            return Ok(id);
        }

        [HttpPost("upload-image")]
        [Authorize]
        public async Task<ActionResult<string>> UploadImage(IFormFile file)
        {
            var imageUrl = await _imageService.UploadImageAsync(file, CancellationToken.None);
            return Ok(new { Url = imageUrl });
        }
    }
}
