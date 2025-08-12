import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'strongpassword123', description: 'Password with minimum 6 characters' })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '0123456789', description: 'Phone number of the user' })
  phone: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'Registered email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongpassword123', description: 'Password of the user' })
  @MinLength(6)
  password: string;
}
