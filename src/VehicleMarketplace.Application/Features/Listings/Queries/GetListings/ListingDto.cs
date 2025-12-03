using VehicleMarketplace.Domain.Entities;

namespace VehicleMarketplace.Application.Features.Listings.Queries.GetListings
{
    public class ListingDto
    {
        public Guid Id { get; set; }
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
        public string CategoryName { get; set; } = string.Empty;
        public string MainImageUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
