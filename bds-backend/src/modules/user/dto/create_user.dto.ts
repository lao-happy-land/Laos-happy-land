import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Multer } from 'multer';
import { ToArray } from './update_user.dto';
import { LocationDto } from 'src/modules/property/dto/create_property.dto';

export class CreateUserDto {
  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Full name of the user',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'nguyenvana@example.com',
    description: 'Email of the user',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Phone number of the user',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the user',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a',
    description: 'Role ID of the user',
  })
  @IsNotEmpty()
  @IsString()
  roleId: string;

  @ApiPropertyOptional({
    type: LocationDto,
    description: 'Location info of the user',
    required: false,
  })
  @IsOptional()
  location?: LocationDto;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Avatar of the user',
  })
  @IsOptional()
  image?: Multer.File;

  @ApiPropertyOptional({
    example: 2,
    description: 'Years of experience (default 0)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  experienceYears?: number;

  @ApiPropertyOptional({
    example: ['Apartment', 'Land'],
    description: 'Specialties of the user',
    type: [String],
  })
  @IsOptional()
  @Type(() => String)
  @ToArray()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @ApiPropertyOptional({
    example: ['Vietnamese', 'English'],
    description: 'Languages the user can speak',
    type: [String],
  })
  @IsOptional()
  @Type(() => String)
  @ToArray()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({
    example: ['Broker License', 'Real Estate Certificate'],
    description: 'Certifications of the user',
    type: [String],
  })
  @IsOptional()
  @ToArray()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @ApiPropertyOptional({
    example: 'ABC Real Estate',
    description: 'Company name of the user',
  })
  @IsOptional()
  @IsString()
  company?: string;
}
