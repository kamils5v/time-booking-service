import mongoose, { FilterQuery } from 'mongoose';

export interface RepositoryRequestParams {
  transactionManager?: mongoose.mongo.ClientSession;
}

export interface FindAllResponse<Entity> {
  total: number;
  data: Entity[];
}

export interface FindAllDetails<Entity> {
  where: FilterQuery<Entity> | Partial<Entity>;
  skip?: number;
  limit?: number;
}

export interface FindOneDetails<Entity> {
  where: FilterQuery<Entity>;
  limit?: number;
  skip?: number;
}

export type FindAllQuery<Entity> = Partial<Entity> | FindAllDetails<Entity>;

export type FindOneQuery<Entity> = Partial<Entity> | FindOneDetails<Entity>;

export interface IRepository<Entity, CreateDto, UpdateDto> {
  create(dto: CreateDto, params?: RepositoryRequestParams): Promise<Entity>;
  update(id: string, dto: UpdateDto, params?: RepositoryRequestParams): Promise<any>;
  findOne(query: FindOneQuery<Entity>, params?: RepositoryRequestParams): Promise<Entity>;
  findAll(query: FindAllQuery<Entity>, params?: RepositoryRequestParams): Promise<FindAllResponse<Entity>>;
  remove(id: string, params?: RepositoryRequestParams): Promise<any>;
}
