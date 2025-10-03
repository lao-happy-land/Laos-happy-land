import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class TermRateDto {
  @ApiProperty({
    example: '3 tháng',
    description: 'Kỳ hạn gửi',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({
    example: 0.5,
    description: 'Lãi suất (%) tương ứng với kỳ hạn',
  })
  @IsNumber()
  interestRate: number;
}

export class CreateBankDto {
  @ApiProperty({
    example: 'Banque pour le Commerce Extérieur Lao (BCEL)',
    description: 'Tên ngân hàng',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: [TermRateDto],
    description: 'Danh sách kỳ hạn và lãi suất',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TermRateDto)
  termRates: TermRateDto[];

  @ApiPropertyOptional({
    description: 'image Bank',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
