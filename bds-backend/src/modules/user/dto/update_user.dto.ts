import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enum/enum';

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

  @ApiPropertyOptional({ example: 'f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a', description: 'Role ID of the user' })
  roleId?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL of the user',
  })
  avatarUrl?: string;
}
