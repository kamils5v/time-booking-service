import { Inject, Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { IDoctorsService } from './interfaces/doctors-service.interface';
import { ServiceRequestParams } from '@libs/shared/interfaces/service.interface';
import { Doctor } from './entities/doctor.entity';
import { FindAllQuery, FindAllResponse, FindOneQuery } from '@libs/shared/interfaces/repository.interface';
import { IDoctorsRepository } from './interfaces/doctors-repository.interface';

@Injectable()
export class DoctorsService implements IDoctorsService {
  constructor(
    @Inject(IDoctorsRepository)
    private readonly repo: IDoctorsRepository,
  ) {}

  async create(dto: CreateDoctorDto, params?: ServiceRequestParams): Promise<Doctor> {
    return await this.repo.create(dto, params);
  }
  async findOne(dto: FindOneQuery<Doctor>, params?: ServiceRequestParams): Promise<Doctor> {
    return await this.repo.findOne(dto, params);
  }
  async findAll(dto: FindAllQuery<Doctor>, params?: ServiceRequestParams): Promise<FindAllResponse<Doctor>> {
    return await this.repo.findAll(dto, params);
  }
  async update(id: string, dto: UpdateDoctorDto, params?: ServiceRequestParams): Promise<Doctor> {
    return await this.repo.update(id, dto, params);
  }
  async remove(id: string, params?: ServiceRequestParams): Promise<any> {
    return await this.repo.remove(id, params);
  }
}
