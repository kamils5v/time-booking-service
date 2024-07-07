import {
  IsDate,
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ReservationStatus } from '../constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'Doctor ID' })
  doctorId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Doctor name' })
  doctorName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'User name' })
  userName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Start' })
  start: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  @ApiProperty({ description: 'Status' })
  status?: ReservationStatus;
}
