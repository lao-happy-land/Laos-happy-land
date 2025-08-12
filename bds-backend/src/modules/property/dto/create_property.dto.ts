import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({
    description: 'Loại bất động sản',
    example: 'apartment',
  })
  @IsString()
  type: string;

  @ApiProperty({
    example: '6933c706-3180-47a0-b56b-c98180d8afda',
    description: 'User ID associated with the order',
  })
  user_id: string;

  @ApiProperty({
    description: 'Tiêu đề tin rao',
    example: 'Căn hộ cao cấp 2PN tại Quận 1, view sông tuyệt đẹp',
  })
  @IsString()
  @MaxLength(500)
  title: string;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết bất động sản',
    example: 'Căn hộ mới, nội thất đầy đủ, gần trung tâm thương mại, trường học...',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Giá bán/cho thuê',
    example: 2500000000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Diện tích (m2)',
    example: 75.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  area?: number;

  @ApiPropertyOptional({
    description: 'Số phòng ngủ',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({
    description: 'Số phòng tắm',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @ApiProperty({
    description: 'Trạng thái xác minh',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
