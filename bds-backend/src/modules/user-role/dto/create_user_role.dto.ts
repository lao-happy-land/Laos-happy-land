import { ApiProperty } from "@nestjs/swagger";

export class CreateUserRoleDto {
    @ApiProperty({ example: 'User', description: 'Role name' })
    name: string
}