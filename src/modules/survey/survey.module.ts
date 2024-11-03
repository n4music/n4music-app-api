import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MemberTransaction,
  Question,
  Survey,
  SurveyFeedback,
} from 'submodules/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      Question,
      SurveyFeedback,
      MemberTransaction,
    ]),
  ],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}
