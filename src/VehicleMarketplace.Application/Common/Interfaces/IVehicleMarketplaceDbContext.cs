using Microsoft.EntityFrameworkCore;
using VehicleMarketplace.Domain.Entities;

namespace VehicleMarketplace.Application.Common.Interfaces
{
    public interface IVehicleMarketplaceDbContext
    {
        DbSet<VehicleListing> VehicleListings { get; }
        DbSet<VehicleImage> VehicleImages { get; }
        DbSet<Category> Categories { get; }
        DbSet<Report> Reports { get; }
        
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
