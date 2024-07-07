import { TelegramMessageFrom } from '@libs/core/telegram/dto/telegram-message.dto';
import { UUIDSchemaType } from '@libs/shared/utils/db/mongo/schema/uuid-schema-type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { randomUUID } from 'crypto';
// import { TelegramMessageFrom } from 'src/telegram/dto/telegram-message.dto';

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export class User {
  // @Transform(({ value }) => value.toString())
  @Prop({
    default: () => randomUUID(),
    type: UUIDSchemaType,
    virtual: 'id',
  })
  @Exclude()
  _id?: string;
  @ApiProperty({ description: `User ID` })
  id: string;

  @Prop({ default: '', maxlength: 255 })
  @ApiProperty({ description: `User name`, maxLength: 255 })
  name: string;

  @Prop({ unique: true, required: true })
  @ApiProperty({ description: `Telegram ID` })
  telegramId?: number;

  @Prop({ default: null })
  telegramData?: TelegramMessageFrom;

  @Exclude()
  __v?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
