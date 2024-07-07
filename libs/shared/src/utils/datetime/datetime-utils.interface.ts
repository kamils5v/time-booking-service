export const IDateTimeUtils = Symbol('IDateTimeUtils');
export interface IDateTimeUtils {
  format(d: Date, format?: string): string;

  parseDate(datetime: string): Promise<moment.Moment>;

  divideWorkDay(periods: { start: string; end: string }[], intervalMinutes: number): string[];
}
