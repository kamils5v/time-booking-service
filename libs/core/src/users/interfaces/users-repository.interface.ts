import { IRepository } from '@libs/shared/interfaces/repository.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export const IUsersRepository = Symbol('IUsersRepository');
export interface IUsersRepository extends IRepository<User, CreateUserDto, UpdateUserDto> {}
