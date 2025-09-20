import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsTypeDto {
  @ApiProperty({
    example: 'Notification',
    description: 'Name of the news type',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
