import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class TelegramMessageChat {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;

  @ApiProperty()
  first_name?: string;
  @ApiProperty()
  last_name?: string;
  @ApiProperty()
  username?: string;

  @IsString()
  @ApiProperty()
  type: string;
}

export class TelegramMessageFrom {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;

  @IsString()
  @ApiProperty()
  first_name: string;

  @IsString()
  @ApiProperty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  language_code?: string;

  @ApiProperty()
  is_bot?: boolean;
}

export class TelegramMessageBody {
  date: number;

  @ValidateNested()
  @Type(() => TelegramMessageChat)
  @IsNotEmpty()
  @ApiProperty({ type: TelegramMessageChat })
  chat: TelegramMessageChat;

  @ValidateNested()
  @Type(() => TelegramMessageFrom)
  @IsNotEmpty()
  @ApiProperty({ type: TelegramMessageFrom })
  from: TelegramMessageFrom;

  @ApiProperty()
  message_id: number;

  @IsString()
  @ApiProperty()
  text: string;
}

export class TelegramMessageDto {
  @IsNumber()
  @ApiProperty()
  update_id: number;

  @ValidateNested()
  @Type(() => TelegramMessageBody)
  @IsNotEmpty()
  @ApiProperty({ type: TelegramMessageBody })
  message: TelegramMessageBody;

  constructor(partial: TelegramMessageDto) {
    Object.assign(this, partial);
  }
}
