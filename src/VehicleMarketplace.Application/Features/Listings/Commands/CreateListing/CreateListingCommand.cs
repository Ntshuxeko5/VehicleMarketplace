using MediatR;

namespace VehicleMarketplace.Application.Features.Listings.Commands.CreateListing
{
    public class CreateListingCommand : IRequest<Guid>
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Year { get; set; }
        public int Mileage { get; set; }
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Transmission { get; set; } = string.Empty;
        public string FuelType { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public string UserId { get; set; } = string.Empty; // In real app, get from CurrentUserService
    }
}
