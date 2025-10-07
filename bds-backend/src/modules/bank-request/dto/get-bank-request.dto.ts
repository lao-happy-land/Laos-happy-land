import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";
import { PageOptionsDto } from "src/common/dtos/pageOption";
import { BankRequestStatus } from "src/common/enum/enum";

export class GetBankRequestDto extends PageOptionsDto {
    @ApiPropertyOptional({
        description: 'status',
        enum : BankRequestStatus,
        example: BankRequestStatus.PENDING
    })
    @IsOptional()
    @IsString()
    @IsIn(Object.values(BankRequestStatus))
    status?: BankRequestStatus
}