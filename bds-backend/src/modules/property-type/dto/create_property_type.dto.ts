import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TransactionEnum } from 'src/common/enum/enum';

export class CreatePropertyTypeDto {
  @ApiProperty({
    example: 'Apartment',
    description: 'Name of the property type',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Hình thức giao dịch',
    example: TransactionEnum.SALE,
    enum: TransactionEnum,
  })
  @IsEnum(TransactionEnum)
  transactionType: TransactionEnum;
}
