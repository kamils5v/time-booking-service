import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

import { IRepository, RepositoryRequestParams } from '@libs/shared/interfaces/repository.interface';
import { AbstractMongooseRepository } from '@libs/shared/utils/db/mongo/abstract/abstract-mongoose.repository';
import { Reservation, ReservationDocument } from '../entities/reservation.entity';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateReservationDto } from '../dto/update-reservation.dto';

@Injectable()
export class ReservationsRepository
  extends AbstractMongooseRepository<Reservation, ReservationDocument, CreateReservationDto, UpdateReservationDto>
  implements IRepository<Reservation, CreateReservationDto, UpdateReservationDto>
{
  constructor(@InjectModel(Reservation.name) model: Model<ReservationDocument>) {
    super(model);
  }
}
