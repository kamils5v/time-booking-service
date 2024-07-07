import { ExecutionContext, CallHandler } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Observable, catchError, concatMap, finalize } from 'rxjs';

export class MongooseTransactionInterceptor {
  constructor(@InjectConnection() private readonly connection: mongoose.Connection) {
    // console.log(`MongooseTransactionInterceptor: connection:`, !!connection);
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const session = await this.connection.startSession();
    // console.log(`MongooseTransactionInterceptor: session:`, session.id.id);
    const transaction = session.startTransaction();
    // console.log(`MongooseTransactionInterceptor: transaction:`, transaction);
    context.switchToHttp().getRequest().transactionManager = session;

    return next.handle().pipe(
      // concatMap gets called when route handler completes successfully
      concatMap(async (data) => {
        // console.log(`TransactionInterceptor.intercept: committing`);
        await session.commitTransaction();
        // console.log(`TransactionInterceptor.intercept: data:`, data);
        return data;
      }),
      // catchError gets called when route handler throws an exception
      catchError(async (e) => {
        // console.log(`TransactionInterceptor.intercept: rolling back`);
        await session.abortTransaction();
        throw e;
      }),
      // always executed, even if catchError method throws an exception
      finalize(async () => {
        await session.endSession();
      }),
    );
    /*
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log(`TransactionInterceptor.intercept`);
    return next.handle().pipe(
      // concatMap gets called when route handler completes successfully
      concatMap(async (data) => {
        await queryRunner.commitTransaction();
        return data;
      }),
      // catchError gets called when route handler throws an exception
      catchError(async (e) => {
        console.log(`TransactionInterceptor.intercept: rolling back`);
        await queryRunner.rollbackTransaction();
        throw e;
      }),
      // always executed, even if catchError method throws an exception
      finalize(async () => {
        await queryRunner.release();
      }),
    );
      */
  }
}
