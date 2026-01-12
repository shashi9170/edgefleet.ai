import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';


export const cookieExtractor = (req: Request): string | null => {
  return req?.cookies?.access || null; 
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.access.secret'), 
        });
    }

    async validate(payload: any) {

        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException("access token expired");
        }

        return user; 
    }
}
