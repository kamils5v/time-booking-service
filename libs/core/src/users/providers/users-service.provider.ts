import { IUsersService } from '../interfaces/users-service.interface';
import { UsersService } from '../users.service';

export const UsersServiceProvider = {
  provide: IUsersService,
  useClass: UsersService,
};
