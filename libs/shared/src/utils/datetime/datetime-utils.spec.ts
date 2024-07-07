import { Test, TestingModule } from '@nestjs/testing';
import { DateTimeUtils } from './datetime.utils';
import { DateTimeMessages } from './constants';

describe('DateTimeUtils', () => {
  let service: DateTimeUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateTimeUtils],
    }).compile();

    service = module.get<DateTimeUtils>(DateTimeUtils);
  });

  // /** keep it to skip faster

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('divideWorkDay: 30 minutes', () => {
    const result = service.divideWorkDay(
      [
        { start: '08:00', end: '13:00' },
        { start: '14:00', end: '17:00' },
      ],
      30,
    );
    expect(result.length).toEqual(16);
  });

  it('divideWorkDay: 1 hour', () => {
    const result = service.divideWorkDay(
      [
        { start: '08:00', end: '13:00' },
        { start: '14:00', end: '17:00' },
      ],
      60,
    );
    expect(result.length).toEqual(8);
  });

  it('parseDate: invalid date', async () => {
    await expect(service.parseDate(`something`)).rejects.toThrow(DateTimeMessages.INVALID_DATE);
  });
  it('parseDate: 15 March', async () => {
    const date = await service.parseDate(`15 March`);
    expect(date.date()).toEqual(15);
    expect(date.month()).toEqual(2);
  });
  it('parseDate: 2 December 2026 15:45', async () => {
    const date = await service.parseDate(`2 December 2026 15:45`);
    expect(date.date()).toEqual(2);
    expect(date.month()).toEqual(11);
    expect(date.year()).toEqual(2026);
    expect(date.hours()).toEqual(15);
    expect(date.minutes()).toEqual(45);
    expect(date.seconds()).toEqual(0);
    expect(date.millisecond()).toEqual(0);
  });

  /** keep it to skip faster */
});
