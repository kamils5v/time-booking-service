import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGO_DATABASE: Joi.string().required(),
        MONGO_URI: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const database = configService.get('MONGO_DATABASE');
        const uri = configService.get('MONGO_URI');
        console.log(`DatabaseModule.init:`, { uri });
        return {
          uri,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
