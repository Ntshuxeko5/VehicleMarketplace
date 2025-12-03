using MediatR;

namespace VehicleMarketplace.Application.Features.Listings.Queries.GetListings
{
    public class GetListingsQuery : IRequest<List<ListingDto>>
    {
        public string? Make { get; set; }
        public string? Model { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? MinYear { get; set; }
        public int? MaxYear { get; set; }
        public int? MaxMileage { get; set; }
        public string? Transmission { get; set; }
        public string? City { get; set; }
        public Guid? CategoryId { get; set; }
    }
}
