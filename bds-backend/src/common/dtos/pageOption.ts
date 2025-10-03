import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { OrderSort } from '../enum/enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PageOptionsDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(OrderSort)
  @IsOptional()
  OrderSort?: OrderSort;

  OrderSortBy?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  perPage?: number;

  get skip(): number {
    if (!this.page || !this.perPage) return 0;
    return (this.page - 1) * this.perPage;
  }
}
