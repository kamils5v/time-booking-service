import { AbstractRepository } from '@libs/shared/abstract/abstract-repository';
import {
  IRepository,
  FindOneQuery,
  RepositoryRequestParams,
  FindOneDetails,
  FindAllQuery,
  FindAllResponse,
  FindAllDetails,
} from '@libs/shared/interfaces/repository.interface';
import { FilterQuery, Model, MongooseUpdateQueryOptions, QueryOptions } from 'mongoose';

export class AbstractMongooseRepository<Entity, EntityDocument, CreateDto, UpdateDto>
  extends AbstractRepository<Entity, CreateDto, UpdateDto>
  implements IRepository<Entity, CreateDto, UpdateDto>
{
  private _model: Model<EntityDocument>;
  public get model() {
    return this._model;
  }
  constructor(model: Model<EntityDocument>) {
    super();
    this._model = model;
  }

  async findOne(query: FindOneQuery<Entity>, params?: RepositoryRequestParams): Promise<Entity> {
    const { transactionManager } = params || {};
    const options: QueryOptions<EntityDocument> = {};
    if (transactionManager) {
      options.session = transactionManager;
    }
    const where = (query as FindOneDetails<Entity>)?.where || query || ({} as any);
    if (where.id) {
      where._id = where.id;
      delete where.id;
    }
    const dataPromise = this.model.findOne(where, null, options);
    return (await dataPromise) as Entity;
  }

  async findAll(query: FindAllQuery<Entity>, params?: RepositoryRequestParams): Promise<FindAllResponse<Entity>> {
    const { transactionManager } = params || {};
    const options: QueryOptions<EntityDocument> = {};
    if (transactionManager) {
      options.session = transactionManager;
    }
    const where = (query as FindAllDetails<Entity>)?.where || query || ({} as any);
    if (where.id) {
      where._id = where.id;
      delete where.id;
    }
    let { skip = 0, limit = 20 } = (query as FindAllDetails<Entity>) || {};
    if (limit > 100) limit = 100;
    if (skip < 0) skip = 0;
    const dataPromise = this.model.find(where, null, options);
    const totalPromise = this.model.countDocuments(where, options as any);
    const [data, total] = await Promise.all([dataPromise, totalPromise]);
    return { total, data: data as Entity[] };
  }

  async create(dto: CreateDto, params?: RepositoryRequestParams): Promise<any> {
    const { transactionManager } = params || {};
    const options: QueryOptions<EntityDocument> = {};
    if (transactionManager) {
      options.session = transactionManager;
    }
    const result = await this.model.create([dto], options);
    const entity = Array.isArray(result) ? result.pop() : result;
    return entity;
  }

  async update(id: string, dto: UpdateDto, params?: RepositoryRequestParams): Promise<any> {
    const { transactionManager } = params || {};
    const options: MongooseUpdateQueryOptions<EntityDocument> = {};
    if (transactionManager) {
      options.session = transactionManager;
    }
    const result = await this.model.updateOne([{ _id: id }], dto, options);
    if (Array.isArray(result)) return result.pop();
    return result;
  }

  async remove(id: string, params?: RepositoryRequestParams): Promise<any> {
    const { transactionManager } = params || {};
    const options: MongooseUpdateQueryOptions<EntityDocument> = {};
    if (transactionManager) {
      options.session = transactionManager;
    }
    const result = await this.model.deleteOne({ _id: id }, options);
    if (Array.isArray(result)) return result.pop();
    return result;
  }
}
