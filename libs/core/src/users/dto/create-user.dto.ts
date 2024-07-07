import { TelegramMessageFrom } from '@libs/core/telegram/dto/telegram-message.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User name' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Telegram ID' })
  @IsNotEmpty()
  telegramId: number;

  @ValidateNested()
  @Type(() => TelegramMessageFrom)
  @ApiProperty({ description: 'Telegram data' })
  @IsOptional()
  telegramData?: TelegramMessageFrom;
}
