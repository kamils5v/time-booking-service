import { IRepository } from '@libs/shared/interfaces/repository.interface';
import { Doctor } from '../entities/doctor.entity';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';

export const IDoctorsRepository = Symbol('IDoctorsRepository');
export interface IDoctorsRepository extends IRepository<Doctor, CreateDoctorDto, UpdateDoctorDto> {}
