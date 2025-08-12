import { ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "src/common/dtos/pageOption";
import { RoleEnum } from "src/common/enum/enum";

export class GetUserDto extends PageOptionsDto {
    @ApiPropertyOptional ({ description: 'Full name of the user'})
    fullName?: string

    @ApiPropertyOptional ({description: 'Email of the user'})
    email?: string

    @ApiPropertyOptional ({ description: 'Phone number of the user'})
    phone?: string

    @ApiPropertyOptional ({ description: 'Role of the user'})
    role?: string

    @ApiPropertyOptional ({description: 'Avatar url of the user'})
    avatarUrl?: string
}