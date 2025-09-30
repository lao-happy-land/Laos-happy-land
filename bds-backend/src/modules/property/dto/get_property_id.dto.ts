import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class GetPropertyDetailDto {
  @ApiPropertyOptional({
    description: 'Loại tiền muốn hiển thị (VD: LAK, USD, VND)',
    example: 'LAK',
  })
  @IsOptional()
  @IsIn(['LAK', 'USD', 'VND'])
  currency?: 'LAK' | 'USD' | 'VND';
}
