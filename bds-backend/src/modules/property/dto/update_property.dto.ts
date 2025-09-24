import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
  IsUUID,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { TransactionEnum } from 'src/common/enum/enum';
import { Multer } from 'multer';
import { Type } from 'class-transformer';
import { LocationDto } from './create_property.dto';

export class UpdatePropertyDto {
  @ApiPropertyOptional({
    description: 'ID loại bất động sản (PropertyType)',
    example: 'f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a',
  })
  @IsOptional()
  @IsUUID()
  typeId?: string;

  // @ApiPropertyOptional({
  //   description: 'ID của LocationInfo',
  //   example: 'd7f6a6a0-1234-5678-9876-abcdefabcdef',
  // })
  // @IsOptional()
  // @IsUUID()
  // locationInfoId?: string;

  @ApiPropertyOptional({
    description: 'Tiêu đề tin rao',
    example: 'Căn hộ cao cấp 2PN tại Quận 1, view sông tuyệt đẹp',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết bất động sản',
    example: 'Căn hộ mới, nội thất đầy đủ...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Giá bán/cho thuê',
    example: 2500000000,
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
    description: 'Vị trí bất động sản (Mapbox object)',
    type: LocationDto,
    required: false,
  })
  @IsOptional()
  location?: LocationDto;

  @ApiPropertyOptional({
    description: 'Hình thức giao dịch',
    example: TransactionEnum.SALE,
    enum: TransactionEnum,
  })
  @IsOptional()
  @IsEnum(TransactionEnum)
  transactionType?: TransactionEnum;

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
}
