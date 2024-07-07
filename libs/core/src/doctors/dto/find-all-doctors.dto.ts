import { ApiProperty } from '@nestjs/swagger';
import { Doctor } from '../entities/doctor.entity';

export class FindAllDoctorsResponse {
  @ApiProperty({ description: `Total rows`, example: 1 })
  total: number;
  @ApiProperty({ type: [Doctor] })
  data: Doctor[];
}
