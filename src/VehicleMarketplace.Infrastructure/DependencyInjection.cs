using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VehicleMarketplace.Application.Common.Interfaces;
using VehicleMarketplace.Infrastructure.Persistence;
using VehicleMarketplace.Infrastructure.Services;

namespace VehicleMarketplace.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(connectionString));

            services.AddScoped<IVehicleMarketplaceDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

            services.AddIdentityCore<IdentityUser>()
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddApiEndpoints();

            services.AddAuthentication()
                .AddBearerToken(IdentityConstants.BearerScheme);
            
            services.AddAuthorizationBuilder();

            services.AddScoped<IImageService, LocalImageService>();

            return services;
        }
    }
}
