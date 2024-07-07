import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TelegramBotServiceProvider } from './providers/telegram-bot-service.provider';
import { TelegramApiServiceProvider } from './providers/telegram-api-service.provider';
import { ConfigServiceProvider } from '@libs/shared/providers/config-service.provider';
import { UsersModule } from '../users/users.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { ReservationsModule } from '../reservations/reservations.module';
import { DateTimeUtilsModule } from '@libs/shared/utils/datetime/datetime-utils.module';
import { TelegramNotificationsServiceProvider } from './providers/telegram-notifications-service.provider';
import { TelegramWebhookController } from './telegram-webhook.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        TELEGRAM_BOT_TOKEN: Joi.string().required(),
        TELEGRAM_BOT_URI: Joi.string().required(),
        TELEGRAM_SKIP_SEND: Joi.bool().optional(),
      }),
    }),
    UsersModule,
    DoctorsModule,
    ReservationsModule,
    DateTimeUtilsModule,
  ],
  providers: [
    TelegramApiServiceProvider,
    TelegramBotServiceProvider,
    TelegramNotificationsServiceProvider,
    ConfigServiceProvider,
  ],
  exports: [TelegramApiServiceProvider, TelegramBotServiceProvider],
  controllers: [TelegramWebhookController],
})
export class TelegramModule {}
