import { ITelegramBotService } from '../interfaces/telegram-bot-service.interface';
import { TelegramBotService } from '../telegram-bot.service';

export const TelegramBotServiceProvider = {
  provide: ITelegramBotService,
  useClass: TelegramBotService,
};
