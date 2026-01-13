import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';


export const cookieExtractor = (req: Request): string | null => {
  return req?.cookies?.access || null; 
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.access.secret'), 
        });
    }

    async validate(payload: any) {

        const token = await this.authService.findRefreshToken(payload.tokenId);

        if(!token){
            throw new UnauthorizedException('Invalid access token');
        }

        const user = await this.usersService.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException("access token expired");
        }

        return user; 
    }
}
