import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PasswordService } from './password.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,

    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],

        useFactory: async (configService: ConfigService) => {
          const jwtConfig = configService.get('jwt'); 
      
          return {
            secret: jwtConfig.access.secret, 
            signOptions: {
              expiresIn: jwtConfig.access.signOptions.expiresIn,
              algorithm: jwtConfig.access.signOptions.algorithm,
            },
        };
      },
    }),
  ],

  providers: [AuthService, PasswordService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy],
})

export class AuthModule {}
