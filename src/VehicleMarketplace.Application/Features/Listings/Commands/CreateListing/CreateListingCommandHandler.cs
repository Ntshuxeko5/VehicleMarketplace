using MediatR;
using VehicleMarketplace.Application.Common.Interfaces;
using VehicleMarketplace.Domain.Entities;

namespace VehicleMarketplace.Application.Features.Listings.Commands.CreateListing
{
    public class CreateListingCommandHandler : IRequestHandler<CreateListingCommand, Guid>
    {
        private readonly IVehicleMarketplaceDbContext _context;

        public CreateListingCommandHandler(IVehicleMarketplaceDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(CreateListingCommand request, CancellationToken cancellationToken)
        {
            var entity = new VehicleListing
            {
                Title = request.Title,
                Description = request.Description,
                Price = request.Price,
                Year = request.Year,
                Mileage = request.Mileage,
                Make = request.Make,
                Model = request.Model,
                Transmission = request.Transmission,
                FuelType = request.FuelType,
                City = request.City,
                Province = request.Province,
                CategoryId = request.CategoryId,
                UserId = request.UserId,
                IsApproved = false, // Default to pending approval
                IsSold = false
            };

            _context.VehicleListings.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
