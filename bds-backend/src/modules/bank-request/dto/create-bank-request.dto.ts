import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBankRequestDto {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+856201234567' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'I would like to partner with your bank',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Url image',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
