# Database Setup Instructions

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=my_nestjs_app

# Application Configuration
NODE_ENV=development
PORT=3000
```

## Database Setup

1. **Install PostgreSQL** (if not already installed)
2. **Create the database**:
   ```sql
   CREATE DATABASE my_nestjs_app;
   ```
3. **Enable UUID extension** (required for UUID primary keys):
   ```sql
   \c my_nestjs_app;
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

## Running Migrations

1. **Run migrations** to create the products table:
   ```bash
   npm run migration:run
   ```

2. **Revert migrations** (if needed):
   ```bash
   npm run migration:revert
   ```

3. **Generate new migrations** (after entity changes):
   ```bash
   npm run migration:generate src/migrations/YourMigrationName
   ```

## Available Scripts

- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert the last migration
- `npm run migration:generate` - Generate a new migration from entity changes
- `npm run migration:create` - Create an empty migration file
- `npm run seed` - Populate the database with demo data
- `npm run seed:reset` - Reset database (revert migrations, run migrations, and seed)

## Products Table Schema

The products table includes the following columns:

- `id` (UUID, Primary Key)
- `name` (VARCHAR 255, Required)
- `description` (TEXT, Optional)
- `price` (DECIMAL 10,2, Required)
- `stock` (INTEGER, Default: 0)
- `category` (VARCHAR 100, Optional)
- `sku` (VARCHAR 255, Optional)
- `isActive` (BOOLEAN, Default: true)
- `createdAt` (TIMESTAMP, Auto-generated)
- `updatedAt` (TIMESTAMP, Auto-updated)

## Indexes

The following indexes are created for better performance:
- `IDX_products_name` - On name column
- `IDX_products_category` - On category column
- `IDX_products_sku` - On sku column
- `IDX_products_isActive` - On isActive column
