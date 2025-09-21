import { DataSource } from 'typeorm';
import { Product } from './models/product.entity';

// TODO:adam maybe reuse this in the app.module.ts?
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'adam',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'my_nestjs_app',
  entities: [Product],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Always false for migrations
  logging: process.env.NODE_ENV === 'development',
});
