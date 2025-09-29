# E-Commerce App API

A comprehensive e-commerce API built with NestJS, TypeORM, and PostgreSQL. This application provides a complete order management system with product catalog, order processing, payment handling, and shipping management.

## 🚀 Features

- **Product Management**: Full CRUD operations for product catalog
- **Order Processing**: Complete order lifecycle management with status tracking
- **Payment Integration**: Support for multiple payment methods
- **Shipping Management**: Address handling and shipping method selection
- **Database Migrations**: Automated schema management with TypeORM
- **Environment Configuration**: Multi-environment support with secure configuration
- **Data Validation**: Comprehensive input validation with class-validator
- **Testing**: Unit and integration tests included

## 🏗️ Architecture

### Core Modules
- **Products Module**: Product catalog management
- **Orders Module**: Order processing and management
- **Configuration Module**: Environment-based configuration
- **Database Module**: TypeORM integration with PostgreSQL

### Database Schema
- **Products**: Product catalog with inventory tracking
- **Orders**: Order management with status tracking
- **Order Items**: Individual items within orders
- **Shipping**: Shipping address and method information
- **Payment**: Payment method and billing information

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ecommerce-app-api
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=ecommerce_app

# Application Configuration
NODE_ENV=development
PORT=3000

# TypeORM Configuration
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=true
```

### 3. Database Setup

1. **Create PostgreSQL database**:
   ```sql
   createdb ecommerce_app_dev
   ```

2. **Enable UUID extension**:
   ```sql
   psql -d ecommerce_app_dev -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
   ```

3. **Run migrations**:
   ```bash
   npm run migration:run
   ```

4. **Seed the database** (optional):
   ```bash
   npm run seed
   ```

## 🚀 Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## 📚 API Documentation

### Products Endpoints

#### Get All Products
```http
GET /products
```

#### Get Product by ID
```http
GET /products/:id
```

### Orders Endpoints

#### Create Order
```http
POST /orders
Content-Type: application/json

{
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "orderItems": [
    {
      "productId": "uuid-here",
      "quantity": 2
    }
  ],
  "shipping": {
    "method": "standard",
    "firstName": "John",
    "lastName": "Doe",
    "addressLine1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "payment": {
    "method": "credit_card",
    "lastFourDigits": "1234",
    "cardBrand": "visa"
  },
  "notes": "Please deliver after 5 PM"
}
```

#### Get All Orders
```http
GET /orders
```

#### Get Order by ID
```http
GET /orders/:id
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🗄️ Database Schema

### Entity Relationships

```
Products (1) ──→ (N) OrderItems (N) ──→ (1) Orders
                                              │
                                              ├── (1) Shipping
                                              └── (1) Payment
```

### Entity Details

#### Products
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `price` (DECIMAL)
- `stock` (INTEGER)
- `category` (VARCHAR)
- `sku` (VARCHAR)
- `isActive` (BOOLEAN)
- `createdAt`, `updatedAt` (TIMESTAMP)

#### Orders
- `id` (UUID, Primary Key)
- `orderNumber` (VARCHAR, Unique)
- `customerEmail` (VARCHAR)
- `customerName` (VARCHAR)
- `customerPhone` (VARCHAR)
- `status` (ENUM: pending, confirmed, processing, shipped, delivered, cancelled, refunded)
- `subtotal`, `taxAmount`, `shippingCost`, `totalAmount` (DECIMAL)
- `currency` (VARCHAR, default: USD)
- `notes` (TEXT)
- `shippedAt`, `deliveredAt` (TIMESTAMP)
- `createdAt`, `updatedAt` (TIMESTAMP)

#### Order Items
- `id` (UUID, Primary Key)
- `orderId` (UUID, Foreign Key)
- `productId` (UUID, Foreign Key)
- `quantity` (INTEGER)
- `unitPrice` (DECIMAL)
- `totalPrice` (DECIMAL)

#### Shipping
- `id` (UUID, Primary Key)
- `orderId` (UUID, Foreign Key)
- `method` (ENUM: standard, express, overnight)
- `firstName`, `lastName` (VARCHAR)
- `addressLine1`, `addressLine2` (VARCHAR)
- `city`, `state`, `postalCode`, `country` (VARCHAR)
- `phone`, `email` (VARCHAR)

#### Payment
- `id` (UUID, Primary Key)
- `orderId` (UUID, Foreign Key)
- `method` (ENUM: credit_card, debit_card, paypal, bank_transfer)
- `lastFourDigits`, `cardBrand` (VARCHAR)
- `expiryMonth`, `expiryYear` (VARCHAR)
- `billingFirstName`, `billingLastName` (VARCHAR)
- `billingAddress` (VARCHAR fields)

## 🔧 Development Workflow

### Database Management

```bash
# Generate migration from entity changes
npm run migration:generate src/migrations/YourMigrationName

# Create empty migration
npm run migration:create src/migrations/YourMigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Reset database (revert + run + seed)
npm run seed:reset
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run build
```

### Console Access

```bash
# Access application console for debugging
npm run console
```

## 📁 Project Structure

```
src/
├── config/           # Configuration files
├── models/           # TypeORM entities
├── migrations/       # Database migrations
├── products/         # Products module
├── orders/           # Orders module
│   └── dto/         # Data Transfer Objects
├── test/            # Test utilities and mocks
└── main.ts          # Application entry point
```

## 🚀 Deployment

### Production Environment Variables

For production deployment, ensure you have the following environment variables configured:

```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-production-username
DB_PASSWORD=your-secure-password
DB_DATABASE=your-production-database
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=false
```

### Build and Deploy

```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Docker Deployment (Optional)

Create a `Dockerfile` in the root directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
EXPOSE 3000

CMD ["node", "dist/main"]
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Class Validator Documentation](https://github.com/typestack/class-validator)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include environment details and error logs

---

**Built with ❤️ using NestJS, TypeORM, and PostgreSQL**
