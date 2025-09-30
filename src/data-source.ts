import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import models from './models';
import configuration from './config/configuration';

// Load environment variables
config();

// Get configuration
const appConfig = configuration();

export const AppDataSource = new DataSource({
  type: 'postgres',
  // Use connection string if available, otherwise use individual parameters
  ...(appConfig.database.url 
    ? { url: appConfig.database.url }
    : {
        host: appConfig.database.host,
        port: appConfig.database.port,
        username: appConfig.database.username,
        password: appConfig.database.password,
        database: appConfig.database.database,
      }
  ),
  entities: Object.values(models),
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Always false for migrations
  logging: appConfig.typeorm.logging,
});
