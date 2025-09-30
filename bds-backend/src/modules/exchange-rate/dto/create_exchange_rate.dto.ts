import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateExchangeRateDto {
    @ApiProperty({
        description: 'currency off exchange rate',
        example: 'USD'
    })
    @IsString()
    currency: string;
    
    @ApiProperty({
        description: 'rate of exchange rate',
        example: 1
    })
    @IsNumber()
    rate: number;
}