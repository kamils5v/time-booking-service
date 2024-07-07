import { EventEmitter2 } from '@nestjs/event-emitter';

export const IEventEmitter = Symbol('IEventEmitter');
export interface IEventEmitter extends EventEmitter2 {}
