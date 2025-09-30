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
    type: [String],
    description: 'List images setting',
  })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({
    description: 'Banner image setting',
  })
  @IsOptional()
  banner?: string;
}
