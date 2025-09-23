import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAboutUsDto {
  @ApiProperty({
    example: 'about us',
    description: 'Title of the about us page',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'abcdefghijklmnopqrstuvwxyz',
    description: 'Content of the about us page',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
