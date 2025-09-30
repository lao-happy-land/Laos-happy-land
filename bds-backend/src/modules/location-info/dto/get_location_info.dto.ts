import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pageOption';

export class GetLocationInfoDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Search of the location Info' })
  @IsOptional()
  @IsString()
  search?: string;
}
