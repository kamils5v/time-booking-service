import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '../entities/reservation.entity';

export class FindAllReservationsResponse {
  @ApiProperty({ description: `Total rows`, example: 1 })
  total: number;
  @ApiProperty({ type: [Reservation] })
  data: Reservation[];
}
