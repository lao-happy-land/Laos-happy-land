import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  IsBoolean,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { PropertyStatusEnum, TransactionEnum } from 'src/common/enum/enum';

export class GetPropertiesFilterDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Loại bất động sản',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm tiêu đề/mô tả',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: 'Giá tối thiểu',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Giá tối đa',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Diện tích tối thiểu (m²)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minArea?: number;

  @ApiPropertyOptional({
    description: 'Diện tích tối đa (m²)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxArea?: number;

  @ApiPropertyOptional({
    description: 'Số phòng ngủ',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({
    description: 'Số phòng tắm',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({ description: 'Vị trí' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái bán/cho thuê',
    enum: TransactionEnum,
  })
  @IsOptional()
  @IsIn(Object.values(TransactionEnum))
  transaction?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái xác minh',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Trạng thái hệ thống',
    enum: PropertyStatusEnum
  })
  @IsOptional()
  @IsIn(Object.values(PropertyStatusEnum))
  status?: string;
}
