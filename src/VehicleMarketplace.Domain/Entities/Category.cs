using VehicleMarketplace.Domain.Common;

namespace VehicleMarketplace.Domain.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        // Navigation property
        public ICollection<VehicleListing> VehicleListings { get; set; } = new List<VehicleListing>();
    }
}
