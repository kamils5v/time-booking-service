import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@libs/shared/utils/db/mongo/mongodb.module';
import { CoreModule } from '@libs/core';

@Module({
  imports: [DatabaseModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
