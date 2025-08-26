import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { RoleEnum } from 'src/common/enum/enum';

export class GetUserDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Search of the user' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Role of the user' })
  @IsOptional()
  @IsString()
  role?: string;
}
