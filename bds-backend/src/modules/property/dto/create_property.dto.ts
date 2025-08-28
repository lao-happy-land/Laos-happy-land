import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsInt,
  Min,
  MaxLength,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { TransactionEnum } from 'src/common/enum/enum';
import { Multer } from 'multer';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @ApiProperty({
    description: 'ID loại bất động sản (PropertyType)',
    example: 'f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a',
  })
  @IsUUID()
  typeId: string;

  @ApiProperty({
    example: '6933c706-3180-47a0-b56b-c98180d8afda',
    description: 'User ID associated with the order',
  })
  @IsUUID()
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
    example:
      'Căn hộ mới, nội thất đầy đủ, gần trung tâm thương mại, trường học...',
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
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({
    description: 'Chi tiết bổ sung (JSON)',
    example: {
      area: 75,
      bedrooms: 3,
      bathrooms: 2,
    },
  })
  @IsOptional()
  details?: any;


  @ApiPropertyOptional({
    description: 'Tình trạng pháp lý',
    example: 'Sổ hồng đầy đủ',
  })
  @IsOptional()
  @IsString()
  legalStatus?: string;

  @ApiPropertyOptional({
    description: 'Vị trí bất động sản',
    example: '123 Nguyễn Huệ, Quận 1, TP.HCM',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Hình thức giao dịch',
    example: TransactionEnum.SALE,
    enum: TransactionEnum,
  })
  @IsEnum(TransactionEnum)
  transactionType: TransactionEnum;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Ảnh chính của bất động sản',
  })
  @IsOptional()
  mainImage?: Multer.File;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Danh sách ảnh phụ của bất động sản',
  })
  @IsOptional()
  images?: Multer.File[];

  priceHistory?: any;
}
