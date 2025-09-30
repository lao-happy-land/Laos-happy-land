import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class TermRateDto {
  @ApiPropertyOptional({
    example: '3 tháng',
    description: 'Kỳ hạn gửi',
  })
  @IsString()
  @IsOptional()
  term: string;

  @ApiPropertyOptional({
    example: 0.5,
    description: 'Lãi suất (%) tương ứng với kỳ hạn',
  })
  @IsNumber()
  @IsOptional()
  interestRate: number;
}

export class UpdateBankDto {
  @ApiPropertyOptional({
    example: 'Banque pour le Commerce Extérieur Lao (BCEL)',
    description: 'Tên ngân hàng',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    type: [TermRateDto],
    description: 'Danh sách kỳ hạn và lãi suất',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TermRateDto)
  termRates: TermRateDto[];
}
