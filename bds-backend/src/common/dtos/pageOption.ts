import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { OrderSort } from '../enum/enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PageOptionsDto {
  @IsString()
  @IsOptional()
  search?: string = '';

  @IsEnum(OrderSort)
  @IsOptional()
  OrderSort?: OrderSort = OrderSort.DESC;

  OrderSortBy?: string = 'id';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiPropertyOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @ApiPropertyOptional()
  perPage?: number = 6;

  get skip(): number {
    return (this.page - 1) * this.perPage;
  }
}