import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Request, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUsersService } from './interfaces/users-service.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithManager } from '@libs/shared/utils/db/mongo/interfaces/request-with-manager.interface';
import { IConfigService } from '@libs/shared/interfaces/config-service.interface';
import { MONGO_NO_TRANSACTIONS } from '@libs/shared/utils/db/mongo/constants';
import { User } from './entities/user.entity';
import { FindAllUsersResponse } from './dto/find-all-users.dto';

@Controller('users')
@ApiTags(`UsersController`)
export class UsersController {
  private skipTransactions = false;
  constructor(
    @Inject(IUsersService)
    private readonly usersService: IUsersService,
    @Inject(IConfigService)
    configService: IConfigService,
  ) {
    this.skipTransactions = String(configService.get(MONGO_NO_TRANSACTIONS)) === 'true';
  }

  @Post()
  @ApiOperation({ description: `Creates new user` })
  @ApiResponse({ status: HttpStatus.CREATED, type: User })
  create(@Body() createUserDto: CreateUserDto, @Request() req: RequestWithManager) {
    const { transactionManager } = req || {};
    return this.usersService.create(createUserDto, {
      transactionManager: !this.skipTransactions && transactionManager,
    });
  }

  @Get()
  @ApiOperation({ description: `Finds list of users` })
  @ApiResponse({ status: HttpStatus.OK, type: FindAllUsersResponse })
  findAll() {
    return this.usersService.findAll({});
  }

  @Get(':id')
  @ApiOperation({ description: `Finds one users` })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }

  @Patch(':id')
  @ApiOperation({ description: `Updates user` })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req: RequestWithManager) {
    const { transactionManager } = req || {};
    return this.usersService.update(id, updateUserDto, {
      transactionManager: !this.skipTransactions && transactionManager,
    });
  }

  @Delete(':id')
  @ApiOperation({ description: `Removes user` })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  remove(@Param('id') id: string, @Request() req: RequestWithManager) {
    const { transactionManager } = req || {};
    return this.usersService.remove(id, {
      transactionManager: !this.skipTransactions && transactionManager,
    });
  }
}
