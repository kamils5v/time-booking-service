import { IConfigService } from '@libs/shared/interfaces/config-service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ITelegramApiService } from './interfaces/telegram-api-service.interface';

@Injectable()
export class TelegramApiService implements ITelegramApiService {
  constructor(@Inject(IConfigService) private readonly configService: IConfigService) {}

  async send(chatId: number, message: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      console.log(`TelegramApiService.send:`, { chatId, message });
      const botUri = this.configService.get('TELEGRAM_BOT_URI');
      const botToken = this.configService.get('TELEGRAM_BOT_TOKEN');

      const url = `${botUri}${botToken}/sendMessage`;
      const payload = {
        parse_mode: 'Markdown',
        chat_id: chatId,
        text: `${message}`,
      };
      const skipSend = this.configService.get('TELEGRAM_SKIP_SEND');
      if (skipSend) {
        console.log(`TelegramApiService: skipping sending`, { payload });
        return resolve({ ok: 1, payload });
      }
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((r) => r.json())
        .then((response) => {
          console.log(`TelegramApiService.send: response:`, response);
          const { ok, result } = response || {};
          if (ok) return resolve(result);
          else return reject(result);
        });
    });
  }
}
