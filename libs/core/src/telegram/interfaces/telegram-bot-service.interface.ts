import { ServiceRequestParams } from '@libs/shared/interfaces/service.interface';
import { TelegramMessageDto } from '../dto/telegram-message.dto';
import { User } from '@libs/core/users/entities/user.entity';

export const ITelegramBotService = Symbol('ITelegramBotService');
export interface ITelegramBotService {
  getUserByMessage(dto: TelegramMessageDto, params: ServiceRequestParams): Promise<User>;
  onMessage(dto: TelegramMessageDto, params?: ServiceRequestParams): Promise<any>;
}
