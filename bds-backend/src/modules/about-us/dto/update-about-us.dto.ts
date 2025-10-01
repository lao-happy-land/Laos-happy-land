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
    example: {
      header: 'about us',
      abc: 'abcd',
    },
    description: 'Content of the about us page',
  })
  @IsOptional()
  content?: string;
}
