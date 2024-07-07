import { IRepository } from '@libs/shared/interfaces/repository.interface';
import { Reservation } from '../entities/reservation.entity';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateReservationDto } from '../dto/update-reservation.dto';

export const IReservationsRepository = Symbol('IReservationsRepository');
export interface IReservationsRepository extends IRepository<Reservation, CreateReservationDto, UpdateReservationDto> {}
