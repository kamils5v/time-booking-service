import { UUIDSchemaType } from '@libs/shared/utils/db/mongo/schema/uuid-schema-type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { randomUUID } from 'crypto';
import { ReservationStatus } from '../constants';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Reservation {
  @Transform(({ value }) => value.toString())
  @Prop({
    default: () => randomUUID(),
    type: UUIDSchemaType,
    virtual: 'id',
  })
  @Exclude()
  _id?: string;

  @ApiProperty({ description: 'Reservation ID' })
  id: string;

  @Prop()
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @Prop()
  @ApiProperty({ description: 'User name' })
  userName: string;

  @Prop()
  @ApiProperty({ description: 'Doctor ID' })
  doctorId: string;

  @Prop()
  @ApiProperty({ description: 'Doctor name' })
  doctorName: string;

  @Prop()
  @ApiProperty({ description: 'Start time' })
  start: Date;

  @Prop({ enum: ReservationStatus, default: ReservationStatus.CREATED })
  @ApiProperty({ description: 'Reservation status', enum: ReservationStatus })
  status: string;

  @Exclude()
  __v?: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

export type ReservationDocument = Reservation & Document;
