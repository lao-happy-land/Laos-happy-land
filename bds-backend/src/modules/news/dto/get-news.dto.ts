import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pageOption';

export class GetNewsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Type',
  })
  @IsOptional()
  @IsString()
  newsType?: string;

  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm tên tin tức',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
