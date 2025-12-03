using FluentValidation;

namespace VehicleMarketplace.Application.Features.Listings.Commands.CreateListing
{
    public class CreateListingCommandValidator : AbstractValidator<CreateListingCommand>
    {
        public CreateListingCommandValidator()
        {
            RuleFor(v => v.Title).NotEmpty().MaximumLength(200);
            RuleFor(v => v.Description).NotEmpty();
            RuleFor(v => v.Price).GreaterThan(0);
            RuleFor(v => v.Year).GreaterThan(1900).LessThanOrEqualTo(DateTime.Now.Year + 1);
            RuleFor(v => v.Mileage).GreaterThanOrEqualTo(0);
            RuleFor(v => v.Make).NotEmpty();
            RuleFor(v => v.Model).NotEmpty();
            RuleFor(v => v.Transmission).NotEmpty();
            RuleFor(v => v.FuelType).NotEmpty();
            RuleFor(v => v.City).NotEmpty();
            RuleFor(v => v.Province).NotEmpty();
            RuleFor(v => v.CategoryId).NotEmpty();
        }
    }
}
