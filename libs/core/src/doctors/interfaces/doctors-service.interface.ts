import { IService } from '@libs/shared/interfaces/service.interface';
import { Doctor } from '../entities/doctor.entity';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';

export const IDoctorsService = Symbol('IDoctorsService');

export interface IDoctorsService extends IService<Doctor, CreateDoctorDto, UpdateDoctorDto> {}
