import { Test, TestingModule } from '@nestjs/testing';
import { TelegramBotService } from '../telegram-bot.service';
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

jest.useFakeTimers().setSystemTime(new Date('2024-07-07 12:00'));

describe('TelegramBotService', () => {
  let service: TelegramBotService;
  let usersService: MockType<IUsersService>;
  let doctorsService: MockType<IDoctorsService>;
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
        TelegramBotService,
        { provide: ITelegramApiService, useValue: telegramApiService },
        {
          provide: IUsersService,
          useFactory: MockServiceFactory,
        },
        {
          provide: IDoctorsService,
          useFactory: MockServiceFactory,
        },
        {
          provide: IReservationsService,
          useValue: reservationsService,
        },
      ],
    }).compile();

    service = module.get<TelegramBotService>(TelegramBotService);

    [usersService, doctorsService] = await Promise.all([
      module.resolve(IUsersService),
      module.resolve(IDoctorsService),
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // /** keep it to skip faster
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getUserByMessage: should create user if not existing', async () => {
    usersService.findOne.mockImplementationOnce(() => Promise.resolve(null));
    usersService.create.mockImplementationOnce(() => Promise.resolve(johnDoe));
    await service.getUserByMessage(mockMessage01, { transactionManager });
    expect(usersService.findOne).toHaveBeenCalledWith(
      { telegramId: mockMessage01.message.from.id },
      { transactionManager },
    );
    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        telegramId: mockMessage01.message.from.id,
        name: expect.any(String),
        telegramData: expect.objectContaining({
          id: mockMessage01.message.from.id,
        }),
      }),
      { transactionManager },
    );
  });

  it('onMessage: should create user if not existing', async () => {
    usersService.findOne.mockImplementationOnce(() => Promise.resolve(null));
    usersService.create.mockImplementationOnce(() => Promise.resolve(johnDoe));
    await service.onMessagePromise(
      {
        ...mockMessage01,
        message: {
          ...mockMessage01.message,
          text: `/doctors`,
        },
      },
      { transactionManager },
    );
    expect(usersService.findOne).toHaveBeenCalledWith(
      { telegramId: mockMessage01.message.from.id },
      { transactionManager },
    );
    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        telegramId: mockMessage01.message.from.id,
        name: expect.any(String),
        telegramData: expect.objectContaining({
          id: mockMessage01.message.from.id,
        }),
      }),
      { transactionManager },
    );
  });

  it('onMessageDoctors: passes error from repo', async () => {
    usersService.findOne.mockImplementationOnce(() => Promise.resolve(johnDoe));
    doctorsService.findAll.mockImplementationOnce(() => {
      throw new Error(`Something went wrong`);
    });
    await expect(
      service.onMessageDoctors(
        '',
        {
          ...mockMessage01,
          message: {
            ...mockMessage01.message,
            text: `/doctors`,
          },
        },
        { transactionManager, user: johnDoe },
      ),
    ).rejects.toThrowError('Something went wrong');

    expect(doctorsService.findAll).toHaveBeenCalledWith({}, { transactionManager });
  });

  it('onMessage: /doctors: should request and send list of doctors', async () => {
    usersService.findOne.mockImplementationOnce(() => Promise.resolve(johnDoe));
    const expected = { total: 2, data: [doctorBobSmith, doctorMatthewJohnson] };
    doctorsService.findAll.mockImplementationOnce(() => Promise.resolve(expected));
    await service.onMessagePromise(
      {
        ...mockMessage01,
        message: {
          ...mockMessage01.message,
          text: `/doctors`,
        },
      },
      { transactionManager },
    );

    expect(usersService.findOne).toHaveBeenCalledWith(
      { telegramId: mockMessage01.message.from.id },
      { transactionManager },
    );

    expect(doctorsService.findAll).toHaveBeenCalledWith({}, { transactionManager });
    expect(telegramApiService.send).toHaveBeenCalledWith(
      johnDoe.telegramId,
      `**Doctors:**\n` + [doctorBobSmith.name, doctorMatthewJohnson.name].join(`\n`),
    );
  });

  it('onMessage: /slots: should request and return available slots', async () => {
    usersService.findOne.mockImplementationOnce(() => Promise.resolve(johnDoe));
    doctorsService.findOne.mockImplementationOnce(() => Promise.resolve(doctorBobSmith));
    const expected = ['13:00', '14:30'];
    reservationsService.getAvailableSlots.mockImplementationOnce(() => Promise.resolve(expected));
    await service.onMessagePromise(
      {
        ...mockMessage01,
        message: {
          ...mockMessage01.message,
          text: `/slots Bob Smith, 1 January`,
        },
      },
      { transactionManager },
    );
    expect(reservationsService.getAvailableSlots).toHaveBeenCalledWith(doctorBobSmith, expect.any(Object), {
      transactionManager,
      user: johnDoe,
    });
    expect(telegramApiService.send).toHaveBeenCalledWith(
      johnDoe.telegramId,
      `**Available slots:**\n` + expected.join(`, `),
    );
  });

  it('onMessage: /reservations: should request and return list of future reservations', async () => {
    usersService.findOne.mockImplementationOnce(() => Promise.resolve(johnDoe));
    const expected = { total: 1, data: [mockReservation01] };
    reservationsService.findAll.mockImplementationOnce(() => Promise.resolve(expected));
    await service.onMessagePromise(
      {
        ...mockMessage01,
        message: {
          ...mockMessage01.message,
          text: `/reservations`,
        },
      },
      { transactionManager },
    );

    expect(reservationsService.findAll).toHaveBeenCalledWith(
      { where: { userId: johnDoe.id, start: { $gt: new Date('2024-07-07 12:00') } } },
      {
        transactionManager,
        user: johnDoe,
      },
    );

    expect(telegramApiService.send).toHaveBeenCalledWith(
      johnDoe.telegramId,
      `**Reservations:**\n` + expected.data.map((item) => `${item.start}: ${item.doctorName}`).join(`\n`),
    );
  });

  it('onMessage: /reserve: should create reservation', async () => {
    usersService.findOne.mockImplementationOnce(() => Promise.resolve(johnDoe));
    reservationsService.create.mockImplementationOnce(() => Promise.resolve(mockReservation01));
    doctorsService.findOne.mockImplementationOnce(() => Promise.resolve(doctorBobSmith));
    await service.onMessagePromise(
      {
        ...mockMessage01,
        message: {
          ...mockMessage01.message,
          text: `/reserve Bob Smith, 1 January 11:30`,
        },
      },
      { transactionManager },
    );

    expect(reservationsService.create).toHaveBeenCalledWith(
      {
        doctorId: doctorBobSmith.id,
        userId: johnDoe.id,
        start: `1 January 11:30`,
      },
      { transactionManager, user: johnDoe },
    );
    expect(telegramApiService.send).toHaveBeenCalledWith(
      johnDoe.telegramId,
      `**Created reservation:**\n${mockReservation01.start}: ${mockReservation01.doctorName}`,
    );
  });
  /** keep it to skip faster */
});
