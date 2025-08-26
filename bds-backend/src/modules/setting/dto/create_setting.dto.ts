import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Multer } from 'multer';

export class CreateSettingDto {
  @ApiPropertyOptional({
    description: 'Description setting',
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Hotline setting',
  })
  @IsOptional()
  hotline?: string;

  @ApiPropertyOptional({
    description: 'Facebook url',
  })
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'List images setting',
  })
  @IsOptional()
  images?: Multer.File[];

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Banner image setting',
  })
  @IsOptional()
  banner?: Multer.File;
}
