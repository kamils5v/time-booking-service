import { Request } from '@nestjs/common';
import mongoose from 'mongoose';
export interface RequestWithManager extends Request {
  transactionManager?: mongoose.mongo.ClientSession;
}
