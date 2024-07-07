import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from '../reservations.controller';
import { IReservationsService } from '../interfaces/reservations-service.interface';
import { MockServiceFactory } from '@libs/shared/abstract/specs/mocks';
import { ConfigServiceProvider } from '@libs/shared/providers/config-service.provider';

describe('ReservationsController', () => {
  let controller: ReservationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        ConfigServiceProvider,
        {
          provide: 'DatabaseConnection',
          useValue: jest.fn(),
        },

        {
          provide: IReservationsService,
          useFactory: MockServiceFactory,
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
