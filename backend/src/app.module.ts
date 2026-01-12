import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configLoaders } from "src/config";

import { AppService } from './app.service';
import { AppController } from './app.controller';
 
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: configLoaders,
    }),

    DatabaseModule,
    UsersModule,
    AuthModule,
    ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
