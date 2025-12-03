using AutoMapper;
using VehicleMarketplace.Application.Features.Listings.Queries.GetListings;
using VehicleMarketplace.Domain.Entities;

namespace VehicleMarketplace.Application.Common.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<VehicleListing, ListingDto>()
                .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.Category.Name))
                .ForMember(d => d.MainImageUrl, opt => opt.MapFrom(s => s.Images.FirstOrDefault(i => i.IsMain) != null ? s.Images.FirstOrDefault(i => i.IsMain)!.ImageUrl : string.Empty));
        }
    }
}
