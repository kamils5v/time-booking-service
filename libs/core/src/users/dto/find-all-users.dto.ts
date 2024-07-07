import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class FindAllUsersResponse {
  @ApiProperty({ description: `Total rows`, example: 1 })
  total: number;
  @ApiProperty({ type: [User] })
  data: User[];
}
