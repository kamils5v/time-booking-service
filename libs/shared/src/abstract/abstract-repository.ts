import { FindAllQuery, FindAllResponse, FindOneQuery, IRepository } from '../interfaces/repository.interface';

export abstract class AbstractRepository<Entity, CreateDto, UpdateDto>
  implements IRepository<Entity, CreateDto, UpdateDto>
{
  abstract create(dto: CreateDto): Promise<Entity>;
  abstract update(id: string, dto: UpdateDto): Promise<any>;
  abstract findOne(query: FindOneQuery<Entity>): Promise<Entity>;
  abstract findAll(query: FindAllQuery<Entity>): Promise<FindAllResponse<Entity>>;
  abstract remove(id: string): Promise<any>;
}
