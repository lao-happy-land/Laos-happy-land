import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyTypeDto {
  @ApiProperty({ example: 'Apartment', description: 'Name of the property type' })
  name: string;
}
