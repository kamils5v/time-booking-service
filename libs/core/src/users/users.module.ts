import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersServiceProvider } from './providers/users-service.provider';
import { UsersRepositoryProvider } from './providers/users-repository.provider';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ConfigServiceProvider } from '@libs/shared/providers/config-service.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGO_NO_TRANSACTIONS: Joi.bool().optional(),
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersServiceProvider, UsersRepositoryProvider, ConfigServiceProvider],
  exports: [UsersServiceProvider],
})
export class UsersModule {}
