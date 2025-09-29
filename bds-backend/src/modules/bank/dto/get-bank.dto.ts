import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PageOptionsDto } from "src/common/dtos/pageOption";

export class GetBankDto extends PageOptionsDto {
    @ApiPropertyOptional({
        description: 'Search of the bank'
    })
    @IsOptional()
    @IsString()
    search?: string
}