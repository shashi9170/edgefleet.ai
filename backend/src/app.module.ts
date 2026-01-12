import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configLoaders } from "src/config";
 
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: configLoaders,
    }),

    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
