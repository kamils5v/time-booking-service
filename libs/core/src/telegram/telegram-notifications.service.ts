import * as moment from 'moment';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ITelegramNotificationsService } from './interfaces/telegram-notifications-service.interface';
import { Inject } from '@nestjs/common';
import { IReservationsService } from '../reservations/interfaces/reservations-service.interface';
import { ITelegramApiService } from './interfaces/telegram-api-service.interface';
import { IUsersService } from '../users/interfaces/users-service.interface';

export class TelegramNotificationsService implements ITelegramNotificationsService {
  constructor(
    @Inject(IReservationsService)
    private readonly reservationsService: IReservationsService,
    @Inject(IUsersService)
    private readonly usersService: IUsersService,
    @Inject(ITelegramApiService)
    private readonly telegramApiService: ITelegramApiService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handler() {
    const timeInTwoHours = moment(new Date()).add(120, 'minutes').milliseconds(0).seconds(0).toDate();
    const timeInOneDay = moment(new Date()).add(1, 'day').milliseconds(0).seconds(0).toDate();

    await Promise.all([
      this.handleNotifications(timeInTwoHours, `**Upcoming reservation in 2 hours:**\n`),
      this.handleNotifications(timeInOneDay, `**Upcoming reservation tomorrow:**\n`),
    ]);
  }

  async handleNotifications(start: Date, messagePrefix: string) {
    const reservations = await this.reservationsService.findAll({ start });
    // console.log(`TelegramNotificationService.handleNotifications:`, reservations);
    if (reservations?.data?.length) {
      const userIds = reservations.data.map((item) => item.userId);
      const users = await this.usersService.findAll({ where: { id: { $in: userIds } } });
      const telegramIdByUserId: Record<string, number> = {};

      for (const user of users?.data || []) {
        telegramIdByUserId[user.id] = user.telegramId;
      }

      let telegramId: number;
      for (const reservation of reservations.data) {
        telegramId = telegramIdByUserId[reservation.userId];
        if (telegramId) {
          await this.telegramApiService.send(
            telegramId,
            `${messagePrefix}${reservation.start}: ${reservation.doctorName}`,
          );
        }
      }
    }
  }
}
