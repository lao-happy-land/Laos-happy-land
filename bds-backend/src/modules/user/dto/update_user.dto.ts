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

  @ApiPropertyOptional({
    enum: RoleEnum,
    example: RoleEnum.USER,
    description: 'Role of the user',
  })
  role?: RoleEnum;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL of the user',
  })
  avatarUrl?: string;
}
