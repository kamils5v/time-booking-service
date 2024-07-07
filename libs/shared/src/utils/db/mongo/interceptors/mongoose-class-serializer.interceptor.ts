import { FindAllResponse } from '@libs/shared/interfaces/repository.interface';
import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Document } from 'mongoose';

function MongooseClassSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof Document)) {
        return document;
      }

      return plainToClass(classToIntercept, document.toJSON());
    }

    private prepareResponse(
      response:
        | PlainLiteralObject
        | PlainLiteralObject[]
        | FindAllResponse<PlainLiteralObject>,
    ) {
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }
      if (Array.isArray(response?.data)) {
        return {
          ...response,
          data: response.data.map(this.changePlainObjectToClass),
        };
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response:
        | PlainLiteralObject
        | PlainLiteralObject[]
        | FindAllResponse<PlainLiteralObject>,
      options: ClassTransformOptions,
    ) {
      console.log(`MongooseClassSerializer.serialize:`, response);
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}

export default MongooseClassSerializerInterceptor;
