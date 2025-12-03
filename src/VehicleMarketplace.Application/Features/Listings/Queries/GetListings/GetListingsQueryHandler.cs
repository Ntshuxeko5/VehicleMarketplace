using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using VehicleMarketplace.Application.Common.Interfaces;

namespace VehicleMarketplace.Application.Features.Listings.Queries.GetListings
{
    public class GetListingsQueryHandler : IRequestHandler<GetListingsQuery, List<ListingDto>>
    {
        private readonly IVehicleMarketplaceDbContext _context;
        private readonly IMapper _mapper;

        public GetListingsQueryHandler(IVehicleMarketplaceDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<ListingDto>> Handle(GetListingsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.VehicleListings
                .Include(x => x.Category)
                .Include(x => x.Images)
                .AsNoTracking()
                .Where(x => x.IsApproved && !x.IsSold); // Only show approved and unsold listings

            if (!string.IsNullOrWhiteSpace(request.Make))
            {
                query = query.Where(x => x.Make.ToLower().Contains(request.Make.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(request.Model))
            {
                query = query.Where(x => x.Model.ToLower().Contains(request.Model.ToLower()));
            }

            if (request.MinPrice.HasValue)
            {
                query = query.Where(x => x.Price >= request.MinPrice.Value);
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(x => x.Price <= request.MaxPrice.Value);
            }
            
            if (request.MinYear.HasValue)
            {
                query = query.Where(x => x.Year >= request.MinYear.Value);
            }

            if (request.MaxYear.HasValue)
            {
                query = query.Where(x => x.Year <= request.MaxYear.Value);
            }

            if (request.MaxMileage.HasValue)
            {
                query = query.Where(x => x.Mileage <= request.MaxMileage.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.Transmission))
            {
                query = query.Where(x => x.Transmission == request.Transmission);
            }

            if (!string.IsNullOrWhiteSpace(request.City))
            {
                query = query.Where(x => x.City.ToLower().Contains(request.City.ToLower()));
            }

            if (request.CategoryId.HasValue)
            {
                query = query.Where(x => x.CategoryId == request.CategoryId.Value);
            }

            return await query
                .ProjectTo<ListingDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}
