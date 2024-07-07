import { BadRequestException, Injectable } from '@nestjs/common';
import * as _moment from 'moment';
import { IDateTimeUtils } from './datetime-utils.interface';
import { DateTimeMessages } from './constants';
const moment = (_moment as any).default || _moment;

@Injectable()
export class DateTimeUtils implements IDateTimeUtils {
  isValidDate(d: any) {
    return d instanceof Date && !isNaN(d as unknown as number);
  }

  format(d: Date, format: string = '') {
    return moment(d).local().format(format);
  }

  async parseDate(datetime: string) {
    let parsedDate: moment.Moment = null;
    const date = this.isValidDate(datetime) ? datetime : new Date(datetime);
    if (!this.isValidDate(date)) {
      throw new BadRequestException(DateTimeMessages.INVALID_DATE);
    }

    parsedDate = moment(date);
    if (parsedDate.year() === 2001) {
      if (parsedDate.month() < moment().month()) {
        parsedDate.year(moment().year() + 1);
      } else {
        parsedDate.year(moment().year());
      }
    }
    parsedDate.seconds(0).milliseconds(0);
    return parsedDate;
  }

  divideWorkDay(periods: { start: string; end: string }[], intervalMinutes: number = 30): string[] {
    const timeSlots: string[] = [];

    for (const period of periods) {
      let startTime = moment(period.start, 'HH:mm');
      const endTime = moment(period.end, 'HH:mm');

      while (startTime < endTime) {
        timeSlots.push(startTime.format('HH:mm'));
        startTime = startTime.add(intervalMinutes, 'minutes');
      }
    }

    return timeSlots;
  }
}
