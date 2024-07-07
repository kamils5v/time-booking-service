import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsController } from '../doctors.controller';
import { IDoctorsService } from '../interfaces/doctors-service.interface';
import { MockServiceFactory } from '@libs/shared/abstract/specs/mocks';
import { ConfigServiceProvider } from '@libs/shared/providers/config-service.provider';

describe('DoctorsController', () => {
  let controller: DoctorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorsController],
      providers: [
        ConfigServiceProvider,
        {
          provide: 'DatabaseConnection',
          useValue: jest.fn(),
        },
        {
          provide: IDoctorsService,
          useFactory: MockServiceFactory,
        },
      ],
    }).compile();

    controller = module.get<DoctorsController>(DoctorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
