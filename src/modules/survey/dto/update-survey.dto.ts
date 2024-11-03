import { PartialType } from '@nestjs/swagger';
import { CreateSurveyFeedbackDto } from './create-survey.dto';

export class UpdateSurveyDto extends PartialType(CreateSurveyFeedbackDto) {}
