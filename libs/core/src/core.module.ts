import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { ReservationsModule } from './reservations/reservations.module';
import { ReservationsServiceProvider } from './reservations/providers/reservations-service.provider';
import { ReservationsRepositoryProvider } from './reservations/providers/reservations-repository.provider';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TelegramModule } from './telegram/telegram.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ReservationsModule,
    UsersModule,
    DoctorsModule,
    TelegramModule,
  ],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}
