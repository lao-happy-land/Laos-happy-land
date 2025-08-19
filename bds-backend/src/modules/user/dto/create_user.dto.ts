import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Multer } from 'multer';


export class CreateUserDto {
  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Full name of the user',
  })
  fullName: string;

  @ApiProperty({
    example: 'nguyenvana@example.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Phone number of the user',
  })
  phone: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the user',
  })
  password: string;

  @ApiProperty({
    example: 'f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a',
    description: 'Role ID of the user',
  })
  roleId: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Avatar of the user',
  })
  @IsOptional()
  image?: Multer.File;
}
