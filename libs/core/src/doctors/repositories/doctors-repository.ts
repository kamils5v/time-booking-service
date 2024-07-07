import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IRepository } from '@libs/shared/interfaces/repository.interface';
import { AbstractMongooseRepository } from '@libs/shared/utils/db/mongo/abstract/abstract-mongoose.repository';
import { Doctor, DoctorDocument } from '../entities/doctor.entity';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';

@Injectable()
export class DoctorsRepository
  extends AbstractMongooseRepository<Doctor, DoctorDocument, CreateDoctorDto, UpdateDoctorDto>
  implements IRepository<Doctor, CreateDoctorDto, UpdateDoctorDto>
{
  constructor(@InjectModel(Doctor.name) model: Model<DoctorDocument>) {
    super(model);
  }
}
