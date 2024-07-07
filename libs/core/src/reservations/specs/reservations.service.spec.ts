import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from '../reservations.service';
import { IReservationsRepository } from '../interfaces/reservations-repository.interface';
import { MockRepoFactory, MockServiceFactory, MockType } from '@libs/shared/abstract/specs/mocks';
import { HttpStatusMessage } from '@libs/shared/constants';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { johnDoe } from '@libs/core/users/specs/mocks';
import { doctorBobSmith } from '@libs/core/doctors/specs/mocks';
import { DateTimeUtilsProvider } from '@libs/shared/utils/datetime/datetime-utils.provider';
import { ReservationsMessage } from '../constants';
import { DoctorsMessage } from '@libs/core/doctors/constants';
import { IDoctorsService } from '@libs/core/doctors/interfaces/doctors-service.interface';
import { DateTimeMessages } from '@libs/shared/utils/datetime/constants';
import { mockReservation01, mockReservation02 } from './mocks';
import * as moment from 'moment';
import { IDateTimeUtils } from '@libs/shared/utils/datetime/datetime-utils.interface';
import { IUsersService } from '@libs/core/users/interfaces/users-service.interface';
import { UsersMessage } from '@libs/core/users/constants';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let repo: MockType<IReservationsRepository>;
  let doctorsService: MockType<IDoctorsService>;
  let usersService: MockType<IUsersService>;
  let datetimeUtils: IDateTimeUtils;

  const transactionManager: any = {};

  const datetime = '1 January 11:30';
  let date: moment.Moment;
  const dateToAssert = moment(new Date(datetime))
    .year(moment().year() + 1)
    .toDate()
    .toUTCString();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        DateTimeUtilsProvider,
        {
          provide: IReservationsRepository,
          useFactory: MockRepoFactory,
        },
        {
          provide: IDoctorsService,
          useFactory: MockServiceFactory,
        },
        {
          provide: IUsersService,
          useFactory: MockServiceFactory,
        },
      ],
    }).compile();

    [service, repo, doctorsService, usersService, datetimeUtils] = await Promise.all([
      module.resolve<ReservationsService>(ReservationsService),
      module.resolve(IReservationsRepository),
      module.resolve(IDoctorsService),
      module.resolve(IUsersService),
      module.resolve(IDateTimeUtils),
    ]);
    date = await datetimeUtils.parseDate(datetime);
  });

  /** keep it to skip tests
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it(`getAvailableSlots: error without doctorId`, async () => {
    await expect(service.getAvailableSlots('', date)).rejects.toThrowError(DoctorsMessage.MISSING_ID);
  });
  it(`getAvailableSlots: error without date`, async () => {
    await expect(service.getAvailableSlots(doctorBobSmith.id, null)).rejects.toThrowError(
      ReservationsMessage.MISSING_DATE,
    );
  });

  it(`getAvailableSlots: error when doctor not found`, async () => {
    doctorsService.findOne.mockImplementationOnce(() => Promise.resolve(null));
    await expect(service.getAvailableSlots(doctorBobSmith.id, date)).rejects.toThrowError(DoctorsMessage.NOT_FOUND);
  });

  it(`getAvailableSlots: bad data from repo`, async () => {
    repo.findAll.mockImplementationOnce(() => Promise.resolve(null));
    doctorsService.findOne.mockImplementationOnce(() => Promise.resolve(doctorBobSmith));

    await expect(service.getAvailableSlots(doctorBobSmith.id, date)).rejects.toThrowError(ReservationsMessage.BAD_DATA);
  });

  it(`getAvailableSlots: no reservations`, async () => {
    repo.findAll.mockImplementationOnce(() =>
      Promise.resolve({
        total: 0,
        data: [],
      }),
    );
    doctorsService.findOne.mockImplementationOnce(() => Promise.resolve(doctorBobSmith));

    const result = await service.getAvailableSlots(doctorBobSmith.id, date);
    expect(result.length).toEqual(16);
  });

  it(`getAvailableSlots: reserved at 11:30 and 15:00`, async () => {
    repo.findAll.mockImplementationOnce(() =>
      Promise.resolve({
        total: 2,
        data: [mockReservation01, mockReservation02],
      }),
    );
    doctorsService.findOne.mockImplementationOnce(() => Promise.resolve(doctorBobSmith));

    const result = await service.getAvailableSlots(doctorBobSmith.id, date);
    expect(result.length).toEqual(14);
    expect(result.indexOf('11:30')).toEqual(-1);
    expect(result.indexOf('15:00')).toEqual(-1);
  });

  it(`create: ${HttpStatusMessage.BAD_REQUEST} for null`, async () => {
    await expect(service.create(null as any)).rejects.toThrowError(HttpStatusMessage.BAD_REQUEST);
  });
  it(`create: ${HttpStatusMessage.BAD_REQUEST} without userId`, async () => {
    const dto: CreateReservationDto = {
      userId: '',
      doctorId: doctorBobSmith.id,
      start: datetime,
    };
    await expect(service.create(dto)).rejects.toThrowError(HttpStatusMessage.BAD_REQUEST);
  });
  it(`create: ${HttpStatusMessage.BAD_REQUEST} without doctorId`, async () => {
    const dto: CreateReservationDto = {
      userId: johnDoe.id,
      userName: johnDoe.name,
      doctorId: '',
      start: datetime,
    };
    await expect(service.create(dto)).rejects.toThrowError(HttpStatusMessage.BAD_REQUEST);
  });
  */

  it(`create: error when slot is not available`, async () => {
    repo.findAll.mockImplementationOnce(() =>
      Promise.resolve({
        total: 1,
        data: [mockReservation01],
      }),
    );
    usersService.findOne.mockImplementationOnce(() => Promise.resolve(johnDoe));
    doctorsService.findOne.mockImplementationOnce(() => Promise.resolve(doctorBobSmith));
    const dto: CreateReservationDto = {
      userId: johnDoe.id,
      userName: johnDoe.name,
      doctorId: doctorBobSmith.id,
      start: datetime,
    };
    await expect(service.create(dto)).rejects.toThrowError(ReservationsMessage.SLOT_NOT_AVAILABLE);
  });

  /*
  it(`create: doctor not found`, async () => {
    repo.findAll.mockImplementationOnce(() =>
      Promise.resolve({
        total: 0,
        data: [],
      }),
    );
    doctorsService.findOne.mockImplementationOnce(() => Promise.resolve(null));
    const dto: CreateReservationDto = {
      userId: johnDoe.id,
      userName: johnDoe.name,
      doctorId: doctorBobSmith.id,
      start: datetime,
    };
    await expect(service.create(dto, { transactionManager })).rejects.toThrowError(DoctorsMessage.NOT_FOUND);
  });

  it(`create: user not found`, async () => {
    repo.findAll.mockImplementationOnce(() =>
      Promise.resolve({
        total: 0,
        data: [],
      }),
    );
    doctorsService.findOne.mockImplementationOnce(() => Promise.resolve(doctorBobSmith));
    usersService.findOne.mockImplementationOnce(() => Promise.resolve(null));
    const dto: CreateReservationDto = {
      userId: johnDoe.id,
      doctorId: doctorBobSmith.id,
      start: datetime,
    };
    await expect(service.create(dto, { transactionManager })).rejects.toThrowError(UsersMessage.NOT_FOUND);
  });

  it(`create: requests repository`, async () => {
    repo.findAll.mockImplementationOnce(() =>
      Promise.resolve({
        total: 0,
        data: [],
      }),
    );
    doctorsService.findOne.mockImplementationOnce(() => Promise.resolve(doctorBobSmith));
    usersService.findOne.mockImplementationOnce(() => Promise.resolve(johnDoe));

    const dto: CreateReservationDto = {
      userId: johnDoe.id,
      doctorId: doctorBobSmith.id,
      start: datetime,
    };
    const result = await service.create(dto, { transactionManager });
    expect(repo.create).toHaveBeenCalledWith(
      {
        ...dto,
        doctorName: doctorBobSmith.name,
        userName: johnDoe.name,
        start: dateToAssert,
      },
      { transactionManager },
    );
  });

  /** keep it to skip tests */
});
