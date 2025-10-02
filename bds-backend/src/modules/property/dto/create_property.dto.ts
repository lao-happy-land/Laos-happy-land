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
  ValidateNested,
} from 'class-validator';
import { TransactionEnum } from 'src/common/enum/enum';
import { Multer } from 'multer';
import { Type } from 'class-transformer';

export class LocationDto {
  @ApiPropertyOptional({ example: 21.028511 })
  @IsOptional()
  @IsNumber()
  latitude: number;

  @ApiPropertyOptional({ example: 105.804817 })
  @IsOptional()

  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ example: '123 Nguyễn Huệ, Quận 1, TP.HCM' })
  @IsOptional()
  @IsString()
  address: string;

  @ApiPropertyOptional({ example: 'Hà Nội' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Vietnam' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: '12A' })
  @IsOptional()
  @IsString()
  buildingNumber?: string;

  @ApiPropertyOptional({ example: 'Nguyễn Huệ' })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({ example: 'Quận 1' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: 'TP.HCM' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ example: '700000' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'Bến Nghé' })
  @IsOptional()
  @IsString()
  neighborhood?: string;
}

export class CreatePropertyDto {
  @ApiProperty({
    description: 'ID loại bất động sản (PropertyType)',
    example: 'f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a',
  })
  @IsUUID()
  typeId: string;

  @ApiProperty({
    description: 'ID của LocationInfo',
    example: 'd7f6a6a0-1234-5678-9876-abcdefabcdef',
  })
  @IsUUID()
  locationInfoId: string;

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

  @ApiProperty({
    description: 'Vị trí bất động sản (Mapbox object)',
    type: LocationDto,
    required: false,
  })
  @IsOptional()
  location?: LocationDto;

  @ApiProperty({
    description: 'Hình thức giao dịch',
    example: TransactionEnum.SALE,
    enum: TransactionEnum,
  })
  @IsEnum(TransactionEnum)
  transactionType: TransactionEnum;

  @ApiPropertyOptional({ description: 'main image' })
  @IsOptional()
  @IsString()
  mainImage?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Danh sách hình anh',
  })
  @IsOptional()
  images?: string[];

  priceHistory?: any;
}
