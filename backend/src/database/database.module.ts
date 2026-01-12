import { Module, Global } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { User, UserSchema } from "./schemas/user.schema";

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('database.mongoUri'),
                dbName: 'edgefleet',
            }),
        }),

        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
    ],
    exports: [MongooseModule],
})

export class DatabaseModule{}