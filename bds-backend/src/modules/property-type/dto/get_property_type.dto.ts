import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pageOption';
import { TransactionEnum } from 'src/common/enum/enum';

export class GetPropertyTypeDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Trạng thái',
    enum: TransactionEnum,
  })
  @IsOptional()
  @IsIn(Object.values(TransactionEnum))
  transaction?: string;
}
