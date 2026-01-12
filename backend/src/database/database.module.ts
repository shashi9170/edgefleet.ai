import { Module, Global } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { User, UserSchema } from "./schemas/user.schema";
import { Project, ProjectSchema } from "./schemas/project.schema";
import { RefreshToken, RefreshTokenSchema } from "./schemas/token.schema";


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
            { name: Project.name, schema: ProjectSchema },
            { name: RefreshToken.name, schema: RefreshTokenSchema }
        ]),
    ],
    exports: [MongooseModule],
})

export class DatabaseModule{}