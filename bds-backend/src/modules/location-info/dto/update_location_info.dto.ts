import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsArray, IsInt, Min } from 'class-validator';
import { Multer } from 'multer';

export class UpdateLocationInfoDto {
  @ApiPropertyOptional({
    example: 'Vinhomes Central Park',
    description: 'Tên địa điểm hoặc khu vực',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Ảnh đại diện của địa điểm (upload file)',
  })
  @IsOptional()
  image?: Multer.File;

  @ApiPropertyOptional({
    example: 0,
    description: 'Số lượt xem ban đầu của địa điểm',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  viewCount?: number;

  @ApiPropertyOptional({
    example: '["District 1","Binh Thanh"]',
    description: 'JSON string mảng các khu vực',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  strict?: string[];
}
