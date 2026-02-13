import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

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
    printLocation(@Body() dto) {
        return this.appService.printLocation(dto.lat, dto.log);
    }
}
