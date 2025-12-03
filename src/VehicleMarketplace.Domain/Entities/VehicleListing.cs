using VehicleMarketplace.Domain.Common;

namespace VehicleMarketplace.Domain.Entities
{
    public class VehicleListing : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Year { get; set; }
        public int Mileage { get; set; }
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Transmission { get; set; } = string.Empty; // Manual, Automatic
        public string FuelType { get; set; } = string.Empty; // Petrol, Diesel, Electric, Hybrid
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public bool IsSold { get; set; }
        public bool IsApproved { get; set; }
        
        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        
        public string UserId { get; set; } = string.Empty; // Foreign key to Identity User
        
        public ICollection<VehicleImage> Images { get; set; } = new List<VehicleImage>();
    }
}
