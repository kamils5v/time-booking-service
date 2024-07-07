import { IDateTimeUtils } from './datetime-utils.interface';
import { DateTimeUtils } from './datetime.utils';

export const DateTimeUtilsProvider = {
  provide: IDateTimeUtils,
  useClass: DateTimeUtils,
};
