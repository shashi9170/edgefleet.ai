import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET_KEY,
  signOptions: {
    expiresIn: `${process.env.JWT_EXPIRE_MINUTES}m`,
    algorithm: process.env.JWT_ALGORITHM || 'HS256',
  },
}));
