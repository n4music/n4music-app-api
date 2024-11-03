import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSurveyFeedbackDto {
  @ApiProperty({ required: true, example: ['A', 'B'] })
  @IsArray()
  answers: string[];

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  note: string;
}
export class CreateManySurveyFeedbackDto {
  @ApiProperty({
    required: true,
    example: [{ questionId: 1, response: ['A', 'B'] }],
  })
  @IsArray()
  listAnswers: { questionId: number; response: string[] }[];

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty({ required: true })
  @IsNumber()
  formId: number;
}
