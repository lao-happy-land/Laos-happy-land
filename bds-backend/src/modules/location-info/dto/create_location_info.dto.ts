import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsInt, Min } from 'class-validator';
import { Multer } from 'multer';
import { Transform } from 'class-transformer';


export class CreateLocationInfoDto {
  @ApiProperty({
    example: 'Vinhomes Central Park',
    description: 'Tên địa điểm hoặc khu vực',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Ảnh đại diện của địa điểm (upload file)',
  })
  @IsOptional()
  image?: Multer.File;

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
