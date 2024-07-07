import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ServiceRequestParams } from '@libs/shared/interfaces/service.interface';
import { Reservation } from './entities/reservation.entity';
import { IReservationsRepository } from './interfaces/reservations-repository.interface';
import { FindAllQuery, FindAllResponse, FindOneQuery } from '@libs/shared/interfaces/repository.interface';
import { validateDto } from '@libs/shared/dto/validate';
import { IReservationsService } from './interfaces/reservations-service.interface';
import { IDateTimeUtils } from '@libs/shared/utils/datetime/datetime-utils.interface';
import { DoctorsMessage } from '../doctors/constants';
import { RESERVATIONS_DEFAULT_SCHEDULE, RESERVATIONS_DEFAULT_SLOT_MINUTES, ReservationsMessage } from './constants';
import { IDoctorsService } from '../doctors/interfaces/doctors-service.interface';
import moment from 'moment';
import { Doctor } from '../doctors/entities/doctor.entity';
import { IUsersService } from '../users/interfaces/users-service.interface';
import { UsersMessage } from '../users/constants';

@Injectable()
export class ReservationsService implements IReservationsService {
  constructor(
    @Inject(IReservationsRepository)
    private readonly repo: IReservationsRepository,
    @Inject(IDoctorsService)
    private readonly doctorsService: IDoctorsService,
    @Inject(IUsersService)
    private readonly usersService: IUsersService,
    @Inject(IDateTimeUtils)
    private readonly datetimeUtils: IDateTimeUtils,
  ) {}

  /**
   * returns time slots available for doctor on specified date
   * @param doctorId doctor ID
   * @param datetime string
   * @param params context params
   * @returns Promise<["11:00", "11:30", ...]>
   */
  async getAvailableSlots(
    doctor: string | Doctor,
    date: moment.Moment,
    params?: ServiceRequestParams,
  ): Promise<string[]> {
    let doctorId = '';
    if (typeof doctor === 'string') {
      doctorId = doctor;
      doctor = null;
    } else if (typeof doctor === 'object') {
      doctorId = doctor?.id;
    }

    if (!doctorId) throw new BadRequestException(DoctorsMessage.MISSING_ID);
    if (!date) throw new BadRequestException(ReservationsMessage.MISSING_DATE);

    if (!doctor) {
      doctor = await this.doctorsService.findOne({ id: doctorId });
      if (!doctor?.id) throw new UnprocessableEntityException(DoctorsMessage.NOT_FOUND);
    }

    const timeSlots = this.datetimeUtils.divideWorkDay(
      RESERVATIONS_DEFAULT_SCHEDULE,
      RESERVATIONS_DEFAULT_SLOT_MINUTES,
    );
    const reservedSlots = await this.getReservedSlots(doctorId, date, params);
    const availableSlots = [];
    for (const slot of timeSlots) {
      if (!reservedSlots[slot]) {
        availableSlots.push(slot);
      }
    }
    return availableSlots;
  }

  /**
   * returns time slots reserved for doctor on specified date
   * @param doctorId doctor ID
   * @param date date parsed by moment
   * @param params context params
   * @returns Promise<{"14:00": true, "15:30": true }>
   */
  private async getReservedSlots(doctorId: string, date: moment.Moment, params?: ServiceRequestParams) {
    const reservations = await this.findAll(
      {
        doctorId,
        start: {
          $gte: date.clone().startOf('day').toDate(),
          $lte: date.clone().endOf('day').toDate(),
        } as any,
      },
      params,
    );

    const { data: reservationsData } = reservations || {};
    if (!Array.isArray(reservationsData)) {
      throw new InternalServerErrorException(ReservationsMessage.BAD_DATA);
    }

    const reservedSlots: Record<string, true> = {};
    reservationsData.map((reservation) => {
      const key = this.datetimeUtils.format(reservation.start, 'HH:mm');
      reservedSlots[key] = true;
    });

    return reservedSlots;
  }

  /**
   * Creates reservations if slot is available
   * @param dto reservation data
   * @param params context params
   * @returns created reservation data
   */
  async create(dto: CreateReservationDto, params?: ServiceRequestParams): Promise<Reservation> {
    await validateDto(CreateReservationDto, dto); // validating again since it is used by other services
    const { doctorId, userId, start } = dto;

    const [doctor, user, date] = await Promise.all([
      this.doctorsService.findOne({ id: doctorId }),
      this.usersService.findOne({ id: userId }),
      this.datetimeUtils.parseDate(start),
    ]);

    // console.log(`ReservationsService.create:`, { doctorId, doctor });
    if (!doctor?.id) throw new UnprocessableEntityException(DoctorsMessage.NOT_FOUND);
    if (!user?.id) throw new UnprocessableEntityException(UsersMessage.NOT_FOUND);

    const availableSlots = await this.getAvailableSlots(doctor, date.clone());
    const slotToCheck = this.datetimeUtils.format(date.toDate(), 'HH:mm');
    // console.log(`ReservationsService.create:`, { date, slotToCheck, availableSlots });
    if (availableSlots.indexOf(slotToCheck) === -1) {
      throw new UnprocessableEntityException(ReservationsMessage.SLOT_NOT_AVAILABLE);
    }
    const reservation = await this.repo.create(
      {
        ...dto,
        doctorName: doctor.name,
        userName: user.name,
        start: date.toDate().toUTCString(),
      },
      params,
    );
    return reservation;
  }

  findOne(dto: FindOneQuery<Reservation>, params?: ServiceRequestParams): Promise<Reservation> {
    return;
  }
  findAll(dto: FindAllQuery<Reservation>, params?: ServiceRequestParams): Promise<FindAllResponse<Reservation>> {
    return this.repo.findAll(dto, params);
  }
  update(id: string, dto: UpdateReservationDto, params?: ServiceRequestParams): Promise<Reservation> {
    return;
  }
  remove(id: string, params?: ServiceRequestParams): Promise<any> {
    return;
  }
}
