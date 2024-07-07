import { Module } from '@nestjs/common';
import { DateTimeUtilsProvider } from './datetime-utils.provider';

@Module({
  providers: [DateTimeUtilsProvider],
  exports: [DateTimeUtilsProvider],
})
export class DateTimeUtilsModule {}
