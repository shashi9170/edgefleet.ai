import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configLoaders } from "src/config";
 
import { DatabaseModule } from './database/database.module';
import { UsersController } from './modules/users/users.controller';
import { AuthController } from './modules/auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: configLoaders,
    }),

    DatabaseModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [],
})
export class AppModule {}
