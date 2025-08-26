import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RejectPropertyDto {
  @ApiPropertyOptional({ description: 'Lý do từ chối' })
  @IsOptional()
  @IsString()
  reason: string;
}
