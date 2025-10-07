import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

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

  @ApiPropertyOptional({ type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfExperience?: number;

  @ApiPropertyOptional({ description: 'Bank ID (UUID)' })
  @IsOptional()
  @IsUUID()
  bankId?: string;

  @ApiProperty({
    description: 'Url image',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
