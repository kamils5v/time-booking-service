import { IDoctorsService } from '../interfaces/doctors-service.interface';
import { DoctorsService } from '../doctors.service';

export const DoctorsServiceProvider = {
  provide: IDoctorsService,
  useClass: DoctorsService,
};
