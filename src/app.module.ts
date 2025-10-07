import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';

/**
 * Creates database configuration for TypeORM
 * Uses connection URL if available, otherwise uses individual connection parameters
 */
const createDatabaseConfig = (configService: ConfigService) => {
  const databaseUrl = configService.get<string>('database.url');
  
  if (databaseUrl) {
    return { url: databaseUrl };
  }
  
  return {
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.database'),
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [
        '.env',
        process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ""
      ].filter(Boolean),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        ...createDatabaseConfig(configService),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: configService.get<boolean>('typeorm.synchronize'),
        logging: configService.get<boolean>('typeorm.logging'),
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    OrdersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
