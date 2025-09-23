import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pageOption';

export class GetAboutUsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm tên about us',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
