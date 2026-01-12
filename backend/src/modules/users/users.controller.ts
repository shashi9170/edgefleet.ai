import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // -------- GET ALL USERS --------
    @Get()
    async getAll() {
        return this.usersService.findAll();
    }

    // -------- GET USER BY ID --------
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getById(@Req() req) {
        
        return {
            success: true,
            status: 200,
            data: req.user,
        };
    }
}