import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService,
        private readonly configService: ConfigService,
    ) {}

    // ---- Register ----
    async register(registerDto: RegisterDto) {
        const hashedPassword = await this.passwordService.hash(registerDto.password);
        const user = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
        });
        
        return this.generateTokens(user);
    }

    // ---- Login ----
    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) return null;

        const isValid = await this.passwordService.compare(password, user.password);
        if (!isValid) return null;

        return user;
    }

    async login(user: any) {
        return this.generateTokens(user);
    }


    // ---- Token Generation ----
    generateTokens(user: any) {
        const payload = { sub: user._id.toString(), email: user.email };
      
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
      
        return { access_token, refresh_token };
    }      
}
