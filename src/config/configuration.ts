export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'username',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'ecommerce_app',
    url: process.env.DATABASE_URL,
  },
  typeorm: {
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true' || process.env.NODE_ENV !== 'production',
    logging: process.env.TYPEORM_LOGGING === 'true' || process.env.NODE_ENV === 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  },
});
