import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { LocationDto } from './location.dto';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    // -------- HEALTH CHECK --------
    @Get('health')
    health() {
        return this.appService.getHealth();
    }

    // -------- API INFO --------
    @Get()
    root() {
        return this.appService.getInfo();
    }

    @Post()
    printLocation(@Body() dto:LocationDto) {
        return this.appService.printLocation(dto.lat, dto.lng);
    }

    @Post("/count)
    printCount(@Body() dto) {
        return this.appService.printCount(dto.cnt);
    }
}
