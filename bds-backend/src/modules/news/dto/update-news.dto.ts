import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateNewsDto {
  @ApiPropertyOptional({
    example: 'Chính sách mới về BĐS',
    description: 'Tiêu đề của tin tức',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({
    example: [
      { type: 'p', value: 'Nội dung chi tiết của tin tức...' },
      { type: 'img', value: 'https://example.com/image.jpg' },
    ],
    description: 'Nội dung chi tiết dạng JSON',
    required: false,
  })
  @IsOptional()
  details?: any;

  @ApiPropertyOptional({
    example: 'b12f8b63-4f0a-4c85-9c48-4e9fa0d1a1f1',
    description: 'ID của loại tin tức (NewsType)',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  newsTypeId?: string;
}
