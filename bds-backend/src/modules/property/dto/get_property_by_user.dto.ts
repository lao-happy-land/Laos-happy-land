import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pageOption';

export class GetPropertyByUserDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Loại tiền muốn hiển thị (VD: LAK, USD, VND)',
    example: 'LAK',
  })
  @IsOptional()
  @IsIn(['LAK', 'USD', 'VND'])
  currency?: 'LAK' | 'USD' | 'VND';

  @ApiPropertyOptional({
    description: 'Nguồn đơn vị tiền tệ cho giá (lấy từ header price-source)',
    example: 'USD',
    enum: ['USD', 'LAK', 'THB'],
    readOnly: true,
  })
  @IsOptional()
  @IsString()
  @IsIn(['USD', 'LAK', 'THB'])
  priceSource?: 'USD' | 'LAK' | 'THB';
}
