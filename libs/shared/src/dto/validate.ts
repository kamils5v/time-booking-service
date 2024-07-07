import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const validateDto = async (dtoClass: any, data: any) => {
  const body = plainToInstance(dtoClass, data || {});
  const errors = await validate(body);
  const errorMessages = errors.flatMap(({ constraints }) => Object.values(constraints));
  if (errorMessages.length) {
    throw new BadRequestException(errorMessages);
  }
};
