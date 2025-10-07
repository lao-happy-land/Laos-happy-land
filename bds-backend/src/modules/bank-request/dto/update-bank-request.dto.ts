// src/modules/bank-request/dto/update-bank-request.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BankRequestStatus } from 'src/common/enum/enum';

export class UpdateBankRequestStatusDto {

  @ApiPropertyOptional({
    description: 'Độ ưu tiên',
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priority?: number;
}
