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

        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('jwt.secret'),
            signOptions: configService.get('jwt.signOptions'),
        }),
    }),

  ],

  providers: [AuthService, JwtStrategy, PasswordService],
  controllers: [AuthController],
  exports: [AuthService],
})

export class AuthModule {}
