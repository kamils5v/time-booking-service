import { Module } from '@nestjs/common';
import { ReservationsServiceProvider } from './providers/reservations-service.provider';
import { ReservationsRepositoryProvider } from './providers/reservations-repository.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './entities/reservation.entity';
import { ReservationsController } from './reservations.controller';
import { DateTimeUtilsModule } from '@libs/shared/utils/datetime/datetime-utils.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { EventEmitterProvider } from '@libs/shared/providers/event-emitter.provider';
import { UsersModule } from '../users/users.module';
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

    MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema }]),
    DateTimeUtilsModule,
    DoctorsModule,
    UsersModule,
  ],
  providers: [ReservationsServiceProvider, ReservationsRepositoryProvider, EventEmitterProvider, ConfigServiceProvider],
  exports: [ReservationsServiceProvider],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
