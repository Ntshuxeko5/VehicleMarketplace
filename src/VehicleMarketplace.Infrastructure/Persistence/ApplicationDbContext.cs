using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VehicleMarketplace.Application.Common.Interfaces;
using VehicleMarketplace.Domain.Entities;

namespace VehicleMarketplace.Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext, IVehicleMarketplaceDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<VehicleListing> VehicleListings { get; set; }
        public DbSet<VehicleImage> VehicleImages { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Report> Reports { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configurations
            builder.Entity<VehicleListing>()
                .Property(v => v.Price)
                .HasColumnType("decimal(18,2)");

            builder.Entity<VehicleListing>()
                .HasOne(v => v.Category)
                .WithMany(c => c.VehicleListings)
                .HasForeignKey(v => v.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<VehicleImage>()
                .HasOne(i => i.VehicleListing)
                .WithMany(v => v.Images)
                .HasForeignKey(i => i.VehicleListingId)
                .OnDelete(DeleteBehavior.Cascade);
                
            // Seed Categories
            builder.Entity<Category>().HasData(
                new Category { Id = Guid.Parse("d28888e9-2ba9-473a-a40f-e38cb54f9b35"), Name = "SUV", Description = "Sport Utility Vehicle" },
                new Category { Id = Guid.Parse("da2fd609-d754-4feb-8acd-c4f9fb13b649"), Name = "Sedan", Description = "Standard car" },
                new Category { Id = Guid.Parse("2902b665-1190-4c70-9915-b9c2d7680450"), Name = "Hatchback", Description = "Small car with rear door" },
                new Category { Id = Guid.Parse("102b566b-ba1f-404c-b2df-e2cde39ade09"), Name = "Bakkie", Description = "Pickup truck" }
            );
        }
    }
}
