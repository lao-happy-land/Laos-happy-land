import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
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

  @ApiPropertyOptional({ description: 'Filter by specialty' })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional({ description: 'Filter by location info ID' })
  @IsOptional()
  @IsString()
  locationInfoId?: string;

  @ApiPropertyOptional({
    description: 'Filter users who requested role upgrade',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  requestedRoleUpgrade?: boolean;

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
