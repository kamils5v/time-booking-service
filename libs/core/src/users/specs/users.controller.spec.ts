import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';

import { IUsersService } from '../interfaces/users-service.interface';
import { MockServiceFactory } from '@libs/shared/abstract/specs/mocks';
import { ConfigServiceProvider } from '@libs/shared/providers/config-service.provider';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        ConfigServiceProvider,
        {
          provide: 'DatabaseConnection',
          useValue: jest.fn(),
        },
        {
          provide: IUsersService,
          useFactory: MockServiceFactory,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
