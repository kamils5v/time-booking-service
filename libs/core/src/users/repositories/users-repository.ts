import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IRepository } from '@libs/shared/interfaces/repository.interface';
import { AbstractMongooseRepository } from '@libs/shared/utils/db/mongo/abstract/abstract-mongoose.repository';
import { User, UserDocument } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersRepository
  extends AbstractMongooseRepository<User, UserDocument, CreateUserDto, UpdateUserDto>
  implements IRepository<User, CreateUserDto, UpdateUserDto>
{
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }
}
