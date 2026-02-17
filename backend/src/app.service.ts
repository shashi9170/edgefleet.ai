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

    printLocations(payload: any) {

    if (!payload?.locations || !Array.isArray(payload.locations)) {
      console.log("No locations received");
      return { success: false };
    }

        console.log(`Total Locations: ${payload.locations.length}`);
        console.log("--------------------------------------------------");
        payload.locations.forEach((loc: any, index: number) => {
        console.log(`Location #${index + 1}`);
        console.log(`Employee ID : ${loc.emp_id}`);
        console.log(`Latitude    : ${loc.latitude}`);
        console.log(`Longitude   : ${loc.longitude}`);
        console.log(`Timestamp   : ${loc.timestamp}`);
        console.log(`Recorded At : ${loc.recorded_at}`);
        console.log(`Address     : ${loc.address}`);
        console.log(`Device Type : ${loc.device_type}`);
        console.log("--------------------------------------------------");
    });

    return { success: true };
  }
}
