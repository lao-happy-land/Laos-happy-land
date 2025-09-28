import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRoleDto {
  @ApiProperty({ example: 'User', description: 'Role name' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;
}
