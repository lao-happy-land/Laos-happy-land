import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateUserFeedbackDto {
  @ApiProperty({
    description: 'ID của môi giới (user được đánh giá)',
    example: 'a3f6b6de-34c9-4f5d-9a62-4b9e6e9b7d21',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Điểm đánh giá (1-5)',
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Nội dung nhận xét',
    example: 'Môi giới rất nhiệt tình và chuyên nghiệp.',
    required: false,
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
