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
import { Transform, Type } from 'class-transformer';
import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { PropertyStatusEnum, TransactionEnum } from 'src/common/enum/enum';

export class GetPropertiesFilterDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Loại bất động sản (có thể truyền nhiều, cách nhau dấu phẩy)',
    example: '1,2,3',
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(',').map((v: string) => v.trim()))
  type?: string[];

  @ApiPropertyOptional({
    description: 'ID của location',
  })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiPropertyOptional({
    description: 'Loại tiền để lọc giá (VD: LAK, USD, VND)',
    example: 'LAK',
  })
  @IsOptional()
  @IsIn(['LAK', 'USD', 'VND'])
  currency?: 'LAK' | 'USD' | 'VND';

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
    description: 'Trạng thái hệ thống',
    enum: PropertyStatusEnum,
  })
  @IsOptional()
  @IsIn(Object.values(PropertyStatusEnum))
  status?: string;

  @ApiPropertyOptional({
    description:
      'Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)',
    enum: ['VND', 'USD', 'LAK'],
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @IsIn(['VND', 'USD', 'LAK'])
  lang?: string;
}
