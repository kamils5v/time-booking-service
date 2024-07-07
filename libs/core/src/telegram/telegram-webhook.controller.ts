import { Body, Controller, Inject, Post, Request, UseInterceptors } from '@nestjs/common';
import { TelegramMessageDto } from './dto/telegram-message.dto';
import { ITelegramBotService } from './interfaces/telegram-bot-service.interface';
import { MongooseTransactionInterceptor } from '@libs/shared/utils/db/mongo/interceptors/mongoose-transaction-interceptor';
import { RequestWithManager } from '@libs/shared/utils/db/mongo/interfaces/request-with-manager.interface';
import MongooseClassSerializerInterceptor from '@libs/shared/utils/db/mongo/interceptors/mongoose-class-serializer.interceptor';

import { IConfigService } from '@libs/shared/interfaces/config-service.interface';
import { User } from '../users/entities/user.entity';
import { MONGO_NO_TRANSACTIONS } from '@libs/shared/utils/db/mongo/constants';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('tg')
@ApiTags(`TelegramWebhookController`)
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class TelegramWebhookController {
  private skipTransactions = false;

  constructor(
    @Inject(ITelegramBotService)
    private readonly telegramBotService: ITelegramBotService,
    @Inject(IConfigService) configService: IConfigService,
  ) {
    this.skipTransactions = String(configService.get(MONGO_NO_TRANSACTIONS)) === 'true';
  }

  @Post('webhook')
  @ApiProperty({ description: 'Webhook handler endpoint' })
  @ApiResponse({ status: 200 })
  @UseInterceptors(MongooseTransactionInterceptor)
  async message(@Body() dto: TelegramMessageDto, @Request() req: RequestWithManager) {
    const { transactionManager } = req || {};
    return await this.telegramBotService.onMessage(dto, {
      transactionManager: !this.skipTransactions && transactionManager,
    });
  }
}
