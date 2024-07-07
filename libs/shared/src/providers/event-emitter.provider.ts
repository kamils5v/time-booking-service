import { EventEmitter2 } from '@nestjs/event-emitter';
import { IEventEmitter } from '../interfaces/event-emitter.interface';

export const EventEmitterProvider = {
  provide: IEventEmitter,
  useExisting: EventEmitter2,
};
