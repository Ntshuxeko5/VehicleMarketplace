using Microsoft.AspNetCore.Http;

namespace VehicleMarketplace.Application.Common.Interfaces
{
    public interface IImageService
    {
        Task<string> UploadImageAsync(IFormFile file, CancellationToken cancellationToken);
    }
}
