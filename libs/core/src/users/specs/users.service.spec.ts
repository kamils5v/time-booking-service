import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { IUsersRepository } from '../interfaces/users-repository.interface';
import { MockRepoFactory, MockType } from '@libs/shared/abstract/specs/mocks';
import { johnDoe } from './mocks';

describe('UsersService', () => {
  let service: UsersService;
  let repo: MockType<IUsersRepository>;

  const transactionManager: any = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: IUsersRepository,
          useFactory: MockRepoFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    [repo] = await Promise.all([module.resolve(IUsersRepository)]);
  });

  // /** keep it to skip faster
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create: requests repository', async () => {
    const dto = { name: johnDoe.name, telegramId: johnDoe.telegramId };
    repo.create.mockResolvedValueOnce(johnDoe);
    const result = await service.create(dto, { transactionManager });
    expect(repo.create).toHaveBeenCalledWith(dto, { transactionManager });
    expect(result).toEqual(johnDoe);
  });

  it('findOne: requests repository', async () => {
    const dto = { name: johnDoe.name };
    repo.findOne.mockResolvedValueOnce(johnDoe);
    const result = await service.findOne(dto, { transactionManager });
    expect(repo.findOne).toHaveBeenCalledWith(dto, { transactionManager });
    expect(result).toEqual(johnDoe);
  });

  it('findAll: requests repository', async () => {
    const dto = { name: johnDoe.name };
    repo.findAll.mockResolvedValueOnce({ total: 1, data: [johnDoe] });
    const result = await service.findAll(dto, { transactionManager });
    expect(repo.findAll).toHaveBeenCalledWith(dto, { transactionManager });
    expect(result).toEqual({ total: 1, data: [johnDoe] });
  });

  it('update: requests repository', async () => {
    const dto = { name: johnDoe.name };
    repo.update.mockResolvedValueOnce(johnDoe);
    const result = await service.update(johnDoe.id, dto, { transactionManager });
    expect(repo.update).toHaveBeenCalledWith(johnDoe.id, dto, { transactionManager });
    expect(result).toEqual(johnDoe);
  });

  it('remove: requests repository', async () => {
    await service.remove(johnDoe.id, { transactionManager });
    expect(repo.remove).toHaveBeenCalledWith(johnDoe.id, { transactionManager });
  });

  /** keep it to skip faster */
});
