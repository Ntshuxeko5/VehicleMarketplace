using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using VehicleMarketplace.Application.Common.Interfaces;
using VehicleMarketplace.Application.Features.Listings.Commands.CreateListing;
using VehicleMarketplace.Domain.Entities;
using Xunit;

namespace VehicleMarketplace.UnitTests.Features.Listings.Commands.CreateListing
{
    public class CreateListingCommandHandlerTests
    {
        private readonly Mock<IVehicleMarketplaceDbContext> _mockContext;
        private readonly CreateListingCommandHandler _handler;

        public CreateListingCommandHandlerTests()
        {
            _mockContext = new Mock<IVehicleMarketplaceDbContext>();
            _handler = new CreateListingCommandHandler(_mockContext.Object);
        }

        [Fact]
        public async Task Handle_ShouldCreateListing_WhenValidRequest()
        {
            // Arrange
            var command = new CreateListingCommand
            {
                Title = "Test Car",
                Description = "Test Description",
                Price = 10000,
                Year = 2020,
                Mileage = 50000,
                Make = "Toyota",
                Model = "Corolla",
                Transmission = "Automatic",
                FuelType = "Petrol",
                City = "Cape Town",
                Province = "WC",
                CategoryId = Guid.NewGuid(),
                UserId = "user123"
            };

            var mockDbSet = new Mock<DbSet<VehicleListing>>();
            _mockContext.Setup(c => c.VehicleListings).Returns(mockDbSet.Object);

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            result.Should().NotBeEmpty();
            mockDbSet.Verify(m => m.Add(It.IsAny<VehicleListing>()), Times.Once);
            _mockContext.Verify(m => m.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
