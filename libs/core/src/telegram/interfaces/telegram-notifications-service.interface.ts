export const ITelegramNotificationsService = Symbol('ITelegramNotificationsService');
export interface ITelegramNotificationsService {
  handler(): Promise<void>;
}
