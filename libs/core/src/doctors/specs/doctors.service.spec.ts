import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsService } from '../doctors.service';
import { IDoctorsRepository } from '../interfaces/doctors-repository.interface';
import { MockRepoFactory, MockType } from '@libs/shared/abstract/specs/mocks';
import { doctorBobSmith } from './mocks';

describe('DoctorsService', () => {
  let service: DoctorsService;
  let repo: MockType<IDoctorsRepository>;

  const transactionManager: any = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorsService,
        {
          provide: IDoctorsRepository,
          useFactory: MockRepoFactory,
        },
      ],
    }).compile();

    service = module.get<DoctorsService>(DoctorsService);
    [repo] = await Promise.all([module.resolve(IDoctorsRepository)]);
  });

  // /** keep it to skip faster
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create: requests repository', async () => {
    const dto = { name: doctorBobSmith.name };
    repo.create.mockResolvedValueOnce(doctorBobSmith);
    const result = await service.create(dto, { transactionManager });
    expect(repo.create).toHaveBeenCalledWith(dto, { transactionManager });
    expect(result).toEqual(doctorBobSmith);
  });

  it('findOne: requests repository', async () => {
    const dto = { name: doctorBobSmith.name };
    repo.findOne.mockResolvedValueOnce(doctorBobSmith);
    const result = await service.findOne(dto, { transactionManager });
    expect(repo.findOne).toHaveBeenCalledWith(dto, { transactionManager });
    expect(result).toEqual(doctorBobSmith);
  });

  it('findAll: requests repository', async () => {
    const dto = { name: doctorBobSmith.name };
    repo.findAll.mockResolvedValueOnce({ total: 1, data: [doctorBobSmith] });
    const result = await service.findAll(dto, { transactionManager });
    expect(repo.findAll).toHaveBeenCalledWith(dto, { transactionManager });
    expect(result).toEqual({ total: 1, data: [doctorBobSmith] });
  });

  it('update: requests repository', async () => {
    const dto = { name: doctorBobSmith.name };
    repo.update.mockResolvedValueOnce(doctorBobSmith);
    const result = await service.update(doctorBobSmith.id, dto, { transactionManager });
    expect(repo.update).toHaveBeenCalledWith(doctorBobSmith.id, dto, { transactionManager });
    expect(result).toEqual(doctorBobSmith);
  });

  it('remove: requests repository', async () => {
    await service.remove(doctorBobSmith.id, { transactionManager });
    expect(repo.remove).toHaveBeenCalledWith(doctorBobSmith.id, { transactionManager });
  });

  /** keep it to skip faster */
});
