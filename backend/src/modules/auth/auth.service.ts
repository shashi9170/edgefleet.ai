import { ConfigService } from '@nestjs/config';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';

import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { RegisterDto } from './dto/register.dto';

import { RefreshToken, RefreshTokenDocument } from 'src/database/schemas/token.schema';



@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService,
        private readonly configService: ConfigService,


        @InjectModel(RefreshToken.name)
        private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    ) {}

    // ---- Register ----
    async register(registerDto: RegisterDto) {
        // Check if user already exists (by email / username)
        const existingUser = await this.usersService.findByEmail(
            registerDto.email,
        );

        if (existingUser) {
            throw new ConflictException(
            'Account already exists. Please login instead',
            );
        }



        const hashedPassword = await this.passwordService.hash(registerDto.password);
        const user = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
        });
        
        return this.generateTokens(user);
    }

    // ---- Login ----
    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmailWithPassword(email);
        if (!user) return null;

        const isValid = await this.passwordService.compare(password, user.password);
        if (!isValid) return null;

        return user;
    }

    async login(user: any) {
        return await this.generateTokens(user);
    }


    async findRefreshToken(tokenId: string){
        return await this.refreshTokenModel.findOne({ tokenId: tokenId });
    }

    // ---- Token Generation ----
    async generateTokens(user: any) {
        const RandomUUID = randomUUID();
        const payload = { sub: user._id.toString(), email: user.email, tokenId: RandomUUID };
      
        const access_token = this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.access.secret'),
            expiresIn: this.configService.get('jwt.access.signOptions.expiresIn'),
            algorithm: this.configService.get('jwt.access.signOptions.algorithm'),
        });
      
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.refresh.secret'),
            expiresIn: this.configService.get('jwt.refresh.signOptions.expiresIn'),
            algorithm: this.configService.get('jwt.refresh.signOptions.algorithm'),
        });


        // Calculate refresh token expiry date
        const refreshExpiresIn = this.configService.get<string>('jwt.refresh.signOptions.expiresIn', '30d');
          
        const expiresAt = new Date(
            Date.now() + this.parseExpiresIn(refreshExpiresIn),
        );

        await this.refreshTokenModel.findOneAndUpdate(
            { userId: user._id },
            { token: refresh_token, tokenId: RandomUUID, expiresAt, isRevoked: false, },
            { upsert: true, new: true, }
        );
          

        return { access_token, refresh_token };
    }  
    
    
    private parseExpiresIn(expiresIn: string | number): number {
        // number → seconds
        if (typeof expiresIn === 'number') {
          return expiresIn * 1000;
        }
      
        const value = expiresIn.trim();
      
        // numeric string → seconds
        if (/^\d+$/.test(value)) {
          return Number(value) * 1000;
        }
      
        // string with unit
        const match = value.match(/^(\d+)(s|m|h|d)$/);
      
        if (!match) {
          throw new Error(
            `Invalid expiresIn format: "${expiresIn}". Use formats like "15m", "1h", "7d"`,
          );
        }
      
        const amount = Number(match[1]);
        const unit = match[2];
      
        const multipliers = {
          s: 1000,
          m: 60 * 1000,
          h: 60 * 60 * 1000,
          d: 24 * 60 * 60 * 1000,
        };
      
        return amount * multipliers[unit];
    }      
}
