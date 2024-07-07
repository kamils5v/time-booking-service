import { IService } from '@libs/shared/interfaces/service.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export const IUsersService = Symbol('IUsersService');
export interface IUsersService extends IService<User, CreateUserDto, UpdateUserDto> {}
