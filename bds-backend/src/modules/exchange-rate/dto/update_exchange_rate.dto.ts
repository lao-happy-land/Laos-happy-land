import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateExchangeRateDto {
  @ApiProperty({
    description: 'rate of exchange rate',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  rate?: number;
}
