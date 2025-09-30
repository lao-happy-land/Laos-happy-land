import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAboutUsDto {
  @ApiPropertyOptional({
    example: 'about us',
    description: 'Title of the about us page',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'abcdefghijklmnopqrstuvwxyz',
    description: 'Content of the about us page',
  })
  @IsString()
  @IsOptional()
  content?: string;
}
