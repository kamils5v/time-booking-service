import { ConfigService } from '@nestjs/config';

export const IConfigService = Symbol('IConfigService');
export interface IConfigService extends ConfigService {}
