import { Connection } from 'mongoose';
import { DoctorSchema } from '../entities/doctor.entity';
import { IDoctorsRepository } from '../interfaces/doctors-repository.interface';
import { DoctorsRepository } from '../repositories/doctors-repository';

export const DoctorsRepositoryProvider = {
  provide: IDoctorsRepository,
  useClass: DoctorsRepository,
};
