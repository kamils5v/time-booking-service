import { User } from '@libs/core/users/entities/user.entity';
import { RepositoryRequestParams, FindAllQuery, FindAllResponse, FindOneQuery } from './repository.interface';

export interface ServiceRequestParams extends RepositoryRequestParams {
  user?: User;
}

export const IService = Symbol('IService');
export interface IService<Entity, CreateDto, UpdateDto> {
  create(dto: CreateDto, params?: ServiceRequestParams): Promise<Entity>;
  update(id: string, dto: UpdateDto, params?: ServiceRequestParams): Promise<Entity>;
  remove(id: string, params?: ServiceRequestParams): Promise<any>;
  findAll(dto: FindAllQuery<Entity>, params?: ServiceRequestParams): Promise<FindAllResponse<Entity>>;
  findOne(dto: FindOneQuery<Entity>, params?: ServiceRequestParams): Promise<Entity>;
}
