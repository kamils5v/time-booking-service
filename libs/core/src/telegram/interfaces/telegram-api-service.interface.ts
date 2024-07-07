export const ITelegramApiService = Symbol('ITelegramApiService');
export interface ITelegramApiService {
  send(chatId: number, message: string): Promise<unknown>;
}
