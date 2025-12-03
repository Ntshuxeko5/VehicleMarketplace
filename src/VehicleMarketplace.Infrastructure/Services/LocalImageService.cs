using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using VehicleMarketplace.Application.Common.Interfaces;

namespace VehicleMarketplace.Infrastructure.Services
{
    public class LocalImageService : IImageService
    {
        private readonly IWebHostEnvironment _environment;

        public LocalImageService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> UploadImageAsync(IFormFile file, CancellationToken cancellationToken)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");

            // Ensure wwwroot/images exists
            var uploadsFolder = Path.Combine(_environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "images");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream, cancellationToken);
            }

            // Return relative path
            return $"/images/{uniqueFileName}";
        }
    }
}
