import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from 'src/common/enum/enum';
import { Multer } from 'multer';
import { Transform, Type } from 'class-transformer';

export function ToArray() {
  return Transform(({ value }) =>
    typeof value === 'string'
      ? value
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
      : value,
  );
}
export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Nguyen Van A',
    description: 'Full name of the user',
  })
  fullName?: string;

  @ApiPropertyOptional({
    example: 'nguyenvana@example.com',
    description: 'Email of the user',
  })
  email?: string;

  @ApiPropertyOptional({
    example: '0123456789',
    description: 'Phone number of the user',
  })
  phone?: string;

  @ApiPropertyOptional({
    example: 'password123',
    description: 'Password of the user',
  })
  password?: string;

  @ApiPropertyOptional({
    example: 'f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a',
    description: 'Role ID of the user',
  })
  roleId?: string;

  @ApiPropertyOptional({
    example: 'f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a',
    description: 'Location Info ID of the user',
  })
  locationInfoId?: string;

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
}
