import { IUsersRepository } from '../interfaces/users-repository.interface';
import { UsersRepository } from '../repositories/users-repository';

export const UsersRepositoryProvider = {
  provide: IUsersRepository,
  useClass: UsersRepository,
};
