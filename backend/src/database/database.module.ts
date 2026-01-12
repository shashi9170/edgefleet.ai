import { Module, Global } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('database.uri'),
                dbName: 'edgefleet',
            }),
        }),

        MongooseModule.forFeature([
            
        ]),
    ],
    exports: [MongooseModule],
})

export class DatabaseModule{}