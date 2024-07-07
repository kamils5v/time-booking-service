import { ITelegramNotificationsService } from '../interfaces/telegram-notifications-service.interface';
import { TelegramNotificationsService } from '../telegram-notifications.service';

export const TelegramNotificationsServiceProvider = {
  provide: ITelegramNotificationsService,
  useClass: TelegramNotificationsService,
};
