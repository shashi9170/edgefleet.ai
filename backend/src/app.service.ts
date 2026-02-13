import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHealth() {
        console.log("hiii");
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }

    getInfo() {
        return {
            name: 'EdgeFleet API',
            version: '1.0.0',
        };
    }

    printLocation(lat, log){
        console.log(`lat ${lat} , log ${log}`);
        return { success: true }
    }

     printCount(cnt){
        console.log(`count -- ${cnt} `);
        return { success: true }
    }
}
