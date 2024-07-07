export enum TelegramBotCommand {
  START = '/start',
  USER = '/user',
  SLOTS = '/slots',
  RESERVE = '/reserve',
  RESERVATIONS = '/reservations',
  DOCTORS = '/doctors',
}

export const TELEGRAM_BOT_HELLO =
  '** Available commands **\n' +
  '*/start* - show help\n' +
  '*/doctors* - list of doctors\n' +
  '*/slots **John Doe, 1 January** * - available slots for John Doe on 1st of January\n' +
  '*/reservations* - list of reservations\n' +
  '*/reserve **John Doe, 1 January 8:00** * - create reservation\n';
