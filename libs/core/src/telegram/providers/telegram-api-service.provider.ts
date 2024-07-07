import { ITelegramApiService } from '../interfaces/telegram-api-service.interface';
import { TelegramApiService } from '../telegram-api.service';

export const TelegramApiServiceProvider = {
  provide: ITelegramApiService,
  useClass: TelegramApiService,
};
