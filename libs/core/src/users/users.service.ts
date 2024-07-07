import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUsersService } from './interfaces/users-service.interface';
import { ServiceRequestParams } from '@libs/shared/interfaces/service.interface';
import { User } from './entities/user.entity';
import { FindAllQuery, FindAllResponse, FindOneQuery } from '@libs/shared/interfaces/repository.interface';
import { IUsersRepository } from './interfaces/users-repository.interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(IUsersRepository)
    private readonly repo: IUsersRepository,
  ) {}

  async create(dto: CreateUserDto, params?: ServiceRequestParams): Promise<User> {
    return await this.repo.create(dto, params);
  }
  async findOne(dto: FindOneQuery<User>, params?: ServiceRequestParams): Promise<User> {
    return await this.repo.findOne(dto, params);
  }
  async findAll(dto: FindAllQuery<User>, params?: ServiceRequestParams): Promise<FindAllResponse<User>> {
    return await this.repo.findAll(dto, params);
  }
  async update(id: string, dto: UpdateUserDto, params?: ServiceRequestParams): Promise<User> {
    return await this.repo.update(id, dto, params);
  }
  async remove(id: string, params?: ServiceRequestParams): Promise<any> {
    return await this.repo.remove(id, params);
  }
}
