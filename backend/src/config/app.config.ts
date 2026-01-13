import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    port: process.env.PORT || 3000,
    globalPrefix: 'api',
    environment: process.env.NODE_ENV || 'development',

    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [],
}));
