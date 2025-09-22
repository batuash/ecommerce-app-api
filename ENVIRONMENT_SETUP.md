# Environment Configuration

This NestJS application uses environment variables for configuration management across different environments.

## Environment Files

The application supports multiple environment files:

- `.env` - Default environment variables
- `.env.development` - Development-specific variables
- `.env.test` - Test-specific variables  
- `.env.production` - Production-specific variables
- `.env.local` - Local overrides (ignored by git)

## Environment Variables

### Application Configuration
- `NODE_ENV` - Environment mode (development, test, production)
- `PORT` - Application port (default: 3000)

### Database Configuration
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USERNAME` - Database username (default: adam)
- `DB_PASSWORD` - Database password (default: password)
- `DB_DATABASE` - Database name (default: my_nestjs_app)

### TypeORM Configuration
- `TYPEORM_SYNCHRONIZE` - Auto-sync database schema (default: true for non-production)
- `TYPEORM_LOGGING` - Enable SQL logging (default: true for development)

## Usage

### Development
```bash
npm run start:dev
```

### Testing
```bash
npm run test
```

### Production
```bash
npm run start:prod
```

## Configuration Service

The application uses NestJS ConfigModule with a centralized configuration file at `src/config/configuration.ts`. This provides:

- Type-safe configuration access
- Environment-specific defaults
- Centralized configuration management

## Database Migrations

Database migrations use the same environment variables as the main application. Make sure your `.env` file is properly configured before running migrations:

```bash
npm run migration:run
```

## Security Notes

- Never commit `.env` files to version control
- Use `.env.example` as a template for required variables
- Use strong passwords and secure database credentials in production
- Consider using environment-specific database names to avoid conflicts
