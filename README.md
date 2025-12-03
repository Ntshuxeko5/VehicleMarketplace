# Vehicle Marketplace 🚗

A full-stack C2C Vehicle Marketplace platform built with ASP.NET Core 8 and Angular 17. Users can buy and sell vehicles with features like authentication, listing management, admin approval, and more.

## 🏗️ Architecture

- **Backend**: ASP.NET Core 8 Web API (Clean Architecture)
- **Frontend**: Angular 17 (Standalone Components)
- **Database**: PostgreSQL
- **Authentication**: JWT Bearer Tokens
- **Styling**: Angular Material + Tailwind CSS
- **Deployment**: Docker + AWS ECS

## 📋 Features

### User Features
- ✅ User registration and authentication
- ✅ Create, edit, and delete vehicle listings
- ✅ Browse and search vehicles
- ✅ View detailed vehicle information
- ✅ Responsive design with custom animations

### Admin Features
- ✅ Approve or reject pending listings
- ✅ Admin dashboard for moderation

### Technical Features
- ✅ Clean Architecture (Domain, Application, Infrastructure, API)
- ✅ CQRS pattern with MediatR
- ✅ FluentValidation for request validation
- ✅ AutoMapper for object mapping
- ✅ Unit tests with xUnit
- ✅ Docker containerization
- ✅ CI/CD with GitHub Actions
- ✅ Custom car-themed loaders and animations

## 🚀 Quick Start

### Prerequisites

- .NET 8 SDK
- Node.js 20+
- Docker & Docker Compose (for containerized setup)
- PostgreSQL (if running locally without Docker)

### Option 1: Run with Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/VehicleMarketplace.git
cd VehicleMarketplace

# Set environment variables (optional)
export DB_PASSWORD="YourSecurePassword"
export JWT_SECRET="YourSuperSecretKey123456789012345"

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger

### Option 2: Run Locally

#### Backend

```bash
cd src/VehicleMarketplace.API

# Update appsettings.Development.json with your database connection string

# Apply database migrations
dotnet ef database update --project ../VehicleMarketplace.Infrastructure

# Run the API
dotnet run
```

#### Frontend

```bash
cd src/VehicleMarketplace.Web

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start
```

Access the application:
- Frontend: http://localhost:4200
- Backend API: https://localhost:7001

## 📦 Project Structure

```
VehicleMarketplace/
├── src/
│   ├── VehicleMarketplace.API/          # Web API Controllers
│   ├── VehicleMarketplace.Application/  # Business Logic (CQRS, Validators)
│   ├── VehicleMarketplace.Domain/       # Domain Entities
│   ├── VehicleMarketplace.Infrastructure/ # Data Access, EF Core
│   ├── VehicleMarketplace.UnitTests/    # Unit Tests
│   └── VehicleMarketplace.Web/          # Angular Frontend
├── Dockerfile.backend                   # Backend Docker image
├── docker-compose.yml                   # Multi-container orchestration
└── .github/
    └── workflows/
        ├── ci.yml                       # Continuous Integration
        └── deploy.yml                   # Continuous Deployment (AWS)
```

## 🧪 Running Tests

### Backend Tests

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Frontend Tests

```bash
cd src/VehicleMarketplace.Web

# Run unit tests
npm test

# Run tests with coverage
npm test -- --code-coverage
```

## 🔧 Configuration

### Backend Configuration

Edit `src/VehicleMarketplace.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=VehicleMarketplaceDb;Username=youruser;Password=yourpassword"
  },
  "JwtSettings": {
    "Secret": "YourSuperSecretKeyHere123456789012345",
    "Issuer": "VehicleMarketplace",
    "Audience": "VehicleMarketplaceUsers",
    "ExpiryMinutes": 1440
  }
}
```

### Frontend Configuration

Edit `src/VehicleMarketplace.Web/src/environments/environment.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api'
};
```

## 🐳 Docker

### Build Images Locally

```bash
# Backend
docker build -t vehiclemarketplace-backend -f Dockerfile.backend .

# Frontend
docker build -t vehiclemarketplace-frontend -f src/VehicleMarketplace.Web/Dockerfile src/VehicleMarketplace.Web
```

### Push to Registry

```bash
# Tag images
docker tag vehiclemarketplace-backend:latest your-registry/vehiclemarketplace-backend:latest
docker tag vehiclemarketplace-frontend:latest your-registry/vehiclemarketplace-frontend:latest

# Push
docker push your-registry/vehiclemarketplace-backend:latest
docker push your-registry/vehiclemarketplace-frontend:latest
```

## ☁️ AWS Deployment

### Prerequisites

1. AWS Account with ECR and ECS access
2. GitHub Secrets configured:
   - `AWS_ACCOUNT_ID`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

### Deployment Process

1. Create ECR repositories:
   ```bash
   aws ecr create-repository --repository-name vehiclemarketplace-backend
   aws ecr create-repository --repository-name vehiclemarketplace-frontend
   ```

2. Create ECS cluster and services (see AWS documentation)

3. Tag and push a release:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. GitHub Actions will automatically build and deploy to AWS ECS

## 🛠️ Development

### Backend Development

```bash
# Add a new migration
dotnet ef migrations add MigrationName --project src/VehicleMarketplace.Infrastructure

# Update database
dotnet ef database update --project src/VehicleMarketplace.Infrastructure

# Generate API client (if using NSwag/OpenAPI)
dotnet tool run swagger tofile --output swagger.json src/VehicleMarketplace.API/bin/Debug/net8.0/VehicleMarketplace.API.dll v1
```

### Frontend Development

```bash
# Generate a new component
ng generate component features/component-name

# Generate a service
ng generate service core/services/service-name

#Build for production
npm run build
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/{id}` - Get listing by ID
- `POST /api/listings` - Create listing (auth required)
- `PUT /api/listings/{id}` - Update listing (auth required)
- `DELETE /api/listings/{id}` - Delete listing (auth required)
- `POST /api/listings/{id}/images` - Upload image (auth required)

### Admin
- `GET /api/admin/pending` - Get pending listings (admin)
- `PUT /api/admin/{id}/approve` - Approve listing (admin)
- `PUT /api/admin/{id}/reject` - Reject listing (admin)

## 🎨 Customization

### Change Theme Colors

Edit `src/VehicleMarketplace.Web/src/styles.css` and `tailwind.config.js` to customize colors and themes.

### Custom Animations

All animations are defined in:
- Global: `src/styles.css`
- Component-specific: `*.component.css` files
- Car loader: `src/app/shared/components/car-loader/car-loader.component.ts`

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check connection string in `appsettings.json`
- Verify database user has correct permissions

### Frontend Build Errors

- Clear node_modules: `rm -rf node_modules && npm install --legacy-peer-deps`
- Clear Angular cache: `rm -rf .angular`
- Check Node.js version (requires 20+)

### Docker Issues

- Increase Docker memory allocation if builds fail
- Check Docker daemon is running
- Clear Docker cache: `docker system prune -a`

## 📚 Tech Stack

### Backend
- ASP.NET Core 8.0
- Entity Framework Core 8.0
- MediatR 12.x
- FluentValidation 11.x
- AutoMapper 12.x
- xUnit 2.x
- PostgreSQL

### Frontend
- Angular 17
- Angular Material 17
- Tailwind CSS 3.x
- RxJS 7.x
- TypeScript 5.x

### DevOps
- Docker & Docker Compose
- GitHub Actions
- AWS ECS & ECR
- Nginx

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Angular Material for UI components
- Tailwind CSS for utility styling
- Clean Architecture principles by Jason Taylor
