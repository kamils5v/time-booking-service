import { IService, ServiceRequestParams } from '@libs/shared/interfaces/service.interface';
import { Reservation } from '../entities/reservation.entity';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateReservationDto } from '../dto/update-reservation.dto';
import { Doctor } from '@libs/core/doctors/entities/doctor.entity';

export const IReservationsService = Symbol('IReservationsService');

export interface IReservationsService extends IService<Reservation, CreateReservationDto, UpdateReservationDto> {
  getAvailableSlots(doctor: Doctor | string, date: moment.Moment, params?: ServiceRequestParams): Promise<string[]>;
}
