import { IReservationsService } from '../interfaces/reservations-service.interface';
import { ReservationsService } from '../reservations.service';

export const ReservationsServiceProvider = {
  provide: IReservationsService,
  useClass: ReservationsService,
};
