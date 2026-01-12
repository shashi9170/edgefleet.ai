import { Controller, Post, Body, Res, UnauthorizedException, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';



@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {}

    // ---------------- REGISTER ----------------
    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.register(registerDto);

        res.cookie('access', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 10 * 60 * 1000, 
        });

        res.cookie('refresh', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, 
        });

        return { message: 'Registered successfully' };
    }

    // ---------------- LOGIN ----------------
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {

        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const tokens = await this.authService.login(user);

        res.cookie('access', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 10 * 60 * 1000,
        });

        res.cookie('refresh', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return { message: 'Logged in successfully' };
    }

    // ---------------- REFRESH TOKEN ----------------
    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies?.Refresh;

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token missing');
        }

        const payload = this.jwtService.verify(refreshToken, {
            secret: this.configService.get<string>('jwt.refresh.secret')
        });

        const user = await this.usersService.findByEmail(payload.email);
        if (!user) throw new UnauthorizedException('User not found');

        const tokens = await this.authService.generateTokens(user);

        res.cookie('access', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 10 * 60 * 1000,
        });

        res.cookie('refresh', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return { message: 'Tokens refreshed successfully' };
    }

    // ---------------- LOGOUT ----------------
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        
        res.clearCookie('access', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        res.clearCookie('refresh', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return { message: 'Logged out successfully' };
    }
}
