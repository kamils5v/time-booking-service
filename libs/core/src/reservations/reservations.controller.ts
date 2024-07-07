import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Request,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { IReservationsService } from './interfaces/reservations-service.interface';
import { IConfigService } from '@libs/shared/interfaces/config-service.interface';
import { RequestWithManager } from '@libs/shared/utils/db/mongo/interfaces/request-with-manager.interface';
import { Reservation } from './entities/reservation.entity';
import { FindAllReservationsResponse } from './dto/find-all-reservations.dto';
import { MONGO_NO_TRANSACTIONS } from '@libs/shared/utils/db/mongo/constants';
import { MongooseTransactionInterceptor } from '@libs/shared/utils/db/mongo/interceptors/mongoose-transaction-interceptor';

@Controller('reservations')
@ApiTags(`ReservationsController`)
export class ReservationsController {
  private skipTransactions = false;
  constructor(
    @Inject(IReservationsService)
    private readonly reservationsService: IReservationsService,
    @Inject(IConfigService)
    configService: IConfigService,
  ) {
    this.skipTransactions = String(configService.get(MONGO_NO_TRANSACTIONS)) === 'true';
  }

  @Post()
  @UseInterceptors(MongooseTransactionInterceptor)
  @ApiOperation({ description: `Creates new reservation` })
  @ApiResponse({ status: HttpStatus.CREATED, type: Reservation })
  create(@Body() createReservationDto: CreateReservationDto, @Request() req: RequestWithManager) {
    const { transactionManager } = req || {};
    return this.reservationsService.create(createReservationDto, {
      transactionManager: !this.skipTransactions && transactionManager,
    });
  }

  @Get()
  @ApiOperation({ description: `Finds list of reservations` })
  @ApiResponse({ status: HttpStatus.OK, type: FindAllReservationsResponse })
  findAll() {
    return this.reservationsService.findAll({});
  }

  @Get(':id')
  @ApiOperation({ description: `Finds one reservation` })
  @ApiResponse({ status: HttpStatus.OK, type: Reservation })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne({ id });
  }

  @Patch(':id')
  @UseInterceptors(MongooseTransactionInterceptor)
  @ApiOperation({ description: `Finds list of reservations` })
  @ApiResponse({ status: HttpStatus.OK, type: Reservation })
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @Request() req: RequestWithManager,
  ) {
    const { transactionManager } = req || {};
    return await this.reservationsService.update(id, updateReservationDto, {
      transactionManager: !this.skipTransactions && transactionManager,
    });
  }

  @Delete(':id')
  @UseInterceptors(MongooseTransactionInterceptor)
  @ApiOperation({ description: `Removes reservation` })
  @ApiResponse({ status: HttpStatus.ACCEPTED, type: Reservation })
  remove(@Param('id') id: string, @Request() req: RequestWithManager) {
    const { transactionManager } = req || {};
    return this.reservationsService.remove(id, {
      transactionManager: !this.skipTransactions && transactionManager,
    });
  }
}
