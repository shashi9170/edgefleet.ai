import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  access: {
    secret: process.env.JWT_ACCESS_SECRET,
    signOptions: {
      expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
      algorithm: process.env.JWT_ALGORITHM ,
    },
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    signOptions: {
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN),
      algorithm: process.env.JWT_ALGORITHM,
    },
  },
}));