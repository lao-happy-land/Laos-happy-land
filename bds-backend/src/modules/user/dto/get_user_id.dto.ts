import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetOneUserDto  {
  @ApiPropertyOptional({
    description: 'Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)',
    enum: ['VND', 'USD', 'LAK'],
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @IsIn(['VND', 'USD', 'LAK'])
  lang?: string;
}
