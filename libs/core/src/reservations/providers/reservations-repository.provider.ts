import { IReservationsRepository } from '../interfaces/reservations-repository.interface';
import { ReservationsRepository } from '../repositories/reservations-repository';

export const ReservationsRepositoryProvider = {
  provide: IReservationsRepository,
  useClass: ReservationsRepository,
};
