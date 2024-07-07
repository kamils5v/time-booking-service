import { UUIDSchemaType } from '@libs/shared/utils/db/mongo/schema/uuid-schema-type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { randomUUID } from 'crypto';

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class Doctor {
  @Transform(({ value }) => value.toString())
  @Prop({
    default: () => randomUUID(),
    type: UUIDSchemaType,
    virtual: 'id',
  })
  @Exclude()
  _id?: string;
  @ApiProperty({ description: 'Doctor ID' })
  id: string;

  @Prop({ default: '', maxlength: 255 })
  @ApiProperty({ description: 'Doctor name', maxLength: 255 })
  name: string;

  @Exclude()
  __v?: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

export type DoctorDocument = Doctor & Document;
