using VehicleMarketplace.Domain.Common;

namespace VehicleMarketplace.Domain.Entities
{
    public class Report : BaseEntity
    {
        public string Reason { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsResolved { get; set; }
        
        public Guid? VehicleListingId { get; set; }
        public VehicleListing? VehicleListing { get; set; }
        
        public string ReportedByUserId { get; set; } = string.Empty;
    }
}
