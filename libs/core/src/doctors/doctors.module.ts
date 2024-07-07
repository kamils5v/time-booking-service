import { Module } from '@nestjs/common';

import { DoctorsController } from './doctors.controller';
import { DateTimeUtilsModule } from '@libs/shared/utils/datetime/datetime-utils.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from './entities/doctor.entity';
import { DoctorsRepositoryProvider } from './providers/doctor-repository.provider';
import { DoctorsServiceProvider } from './providers/doctor-service.provider';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ConfigServiceProvider } from '@libs/shared/providers/config-service.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGO_NO_TRANSACTIONS: Joi.bool().optional(),
      }),
    }),
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    DateTimeUtilsModule,
  ],
  providers: [DoctorsServiceProvider, DoctorsRepositoryProvider, ConfigServiceProvider],
  exports: [DoctorsServiceProvider],
  controllers: [DoctorsController],
})
export class DoctorsModule {}
