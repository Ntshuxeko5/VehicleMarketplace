using VehicleMarketplace.Domain.Common;

namespace VehicleMarketplace.Domain.Entities
{
    public class VehicleImage : BaseEntity
    {
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsMain { get; set; }
        
        public Guid VehicleListingId { get; set; }
        public VehicleListing VehicleListing { get; set; } = null!;
    }
}
