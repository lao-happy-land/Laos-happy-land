import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pageOption';

export class GetLocationInfoDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Search of the location Info' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description:
      'Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)',
    enum: ['VND', 'USD', 'LAK'],
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @IsIn(['VND', 'USD', 'LAK'])
  lang?: string;
}
