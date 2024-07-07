import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Inject,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { IDoctorsService } from './interfaces/doctors-service.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongooseTransactionInterceptor } from '@libs/shared/utils/db/mongo/interceptors/mongoose-transaction-interceptor';
import { Doctor } from './entities/doctor.entity';
import { FindAllDoctorsResponse } from './dto/find-all-doctors.dto';
import { IConfigService } from '@libs/shared/interfaces/config-service.interface';
import { MONGO_NO_TRANSACTIONS } from '@libs/shared/utils/db/mongo/constants';
import { RequestWithManager } from '@libs/shared/utils/db/mongo/interfaces/request-with-manager.interface';

@Controller('doctors')
@ApiTags(`DoctorsController`)
export class DoctorsController {
  private skipTransactions = false;
  constructor(
    @Inject(IDoctorsService) private readonly doctorsService: IDoctorsService,
    @Inject(IConfigService)
    configService: IConfigService,
  ) {
    this.skipTransactions = String(configService.get(MONGO_NO_TRANSACTIONS)) === 'true';
  }

  @Post()
  @UseInterceptors(MongooseTransactionInterceptor)
  @ApiOperation({ description: `Creates new doctor` })
  @ApiResponse({ status: HttpStatus.CREATED, type: Doctor })
  create(@Body() createDoctorDto: CreateDoctorDto, @Request() req: RequestWithManager) {
    const { transactionManager } = req || {};
    return this.doctorsService.create(createDoctorDto, {
      transactionManager: !this.skipTransactions && transactionManager,
    });
  }

  @Get()
  @ApiOperation({ description: `Finds list of doctors` })
  @ApiResponse({ status: HttpStatus.OK, type: FindAllDoctorsResponse })
  findAll() {
    return this.doctorsService.findAll({});
  }

  @Get(':id')
  @ApiOperation({ description: `Creates one doctor` })
  @ApiResponse({ status: HttpStatus.OK, type: Doctor })
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne({ id });
  }

  @Patch(':id')
  @UseInterceptors(MongooseTransactionInterceptor)
  @ApiOperation({ description: `Updates doctor` })
  @ApiResponse({ status: HttpStatus.OK, type: Doctor })
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto, @Request() req: RequestWithManager) {
    const { transactionManager } = req || {};
    return this.doctorsService.update(id, updateDoctorDto, {
      transactionManager: !this.skipTransactions && transactionManager,
    });
  }

  @Delete(':id')
  @UseInterceptors(MongooseTransactionInterceptor)
  @ApiOperation({ description: `Removes doctor` })
  @ApiResponse({ status: HttpStatus.OK, type: Doctor })
  remove(@Param('id') id: string, @Request() req: RequestWithManager) {
    const { transactionManager } = req || {};
    return this.doctorsService.remove(id, {
      transactionManager: !this.skipTransactions && transactionManager,
    });
  }
}
