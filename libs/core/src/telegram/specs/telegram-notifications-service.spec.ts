import { Test, TestingModule } from '@nestjs/testing';

import { MockServiceFactory, MockType } from '@libs/shared/abstract/specs/mocks';
import { IUsersService } from '@libs/core/users/interfaces/users-service.interface';
import { IReservationsService } from '@libs/core/reservations/interfaces/reservations-service.interface';
import { mockMessage01 } from './mocks';
import { johnDoe } from '@libs/core/users/specs/mocks';
import { IDoctorsService } from '@libs/core/doctors/interfaces/doctors-service.interface';
import { doctorBobSmith, doctorMatthewJohnson } from '@libs/core/doctors/specs/mocks';
import { DateTimeUtilsProvider } from '@libs/shared/utils/datetime/datetime-utils.provider';
import { mockReservation01 } from '@libs/core/reservations/specs/mocks';
import { ITelegramApiService } from '../interfaces/telegram-api-service.interface';
import { TelegramNotificationsService } from '../telegram-notifications.service';

jest.useFakeTimers().setSystemTime(new Date('2024-07-07 12:00'));

describe('TelegramNotificationsService', () => {
  let service: TelegramNotificationsService;
  let usersService: MockType<IUsersService>;

  const reservationsService: MockType<IReservationsService> = {
    getAvailableSlots: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
  };
  const telegramApiService: MockType<ITelegramApiService> = {
    send: jest.fn(),
  };
  const transactionManager: any = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DateTimeUtilsProvider,
        TelegramNotificationsService,
        { provide: ITelegramApiService, useValue: telegramApiService },
        {
          provide: IUsersService,
          useFactory: MockServiceFactory,
        },
        {
          provide: IReservationsService,
          useValue: reservationsService,
        },
      ],
    }).compile();

    service = module.get<TelegramNotificationsService>(TelegramNotificationsService);

    [usersService] = await Promise.all([module.resolve(IUsersService)]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // /** keep it to skip faster
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('handler', async () => {
    usersService.findAll.mockImplementationOnce(() =>
      Promise.resolve({
        total: 1,
        data: [johnDoe],
      }),
    );
    reservationsService.findAll.mockImplementationOnce(() =>
      Promise.resolve({
        total: 1,
        data: [mockReservation01],
      }),
    );
    await service.handler();
    expect(reservationsService.findAll).toHaveBeenCalledTimes(2);
    expect(reservationsService.findAll).toHaveBeenCalledWith({
      start: new Date('2024-07-07 14:00'),
    });
    expect(reservationsService.findAll).toHaveBeenCalledWith({
      start: new Date('2024-07-08 12:00'),
    });
    expect(telegramApiService.send).toHaveBeenCalledWith(
      johnDoe.telegramId,
      `**Upcoming reservation in 2 hours:**\n${mockReservation01.start}: ${mockReservation01.doctorName}`,
    );
  });

  /** keep it to skip faster */
});
