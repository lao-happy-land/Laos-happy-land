import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { OrderSort } from '../enum/enum';

export class PageOptionsDto {
  @IsString()
  search?: string = '';

  @IsEnum(OrderSort)
  @IsOptional()
  OrderSort?: OrderSort = OrderSort.DESC;

  OrderSortBy?: string = 'id';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  take?: number = 6;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
