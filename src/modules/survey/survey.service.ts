import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateManySurveyFeedbackDto,
  CreateSurveyFeedbackDto,
} from './dto/create-survey.dto';

import { ErrorHttpException } from 'submodules/common/exceptions/throw.exception';
import { Member } from 'submodules/entities';
import { Question } from 'submodules/entities/question.entity';
import { SurveyFeedback } from 'submodules/entities/survey-feedback.entity';
import { Survey } from 'submodules/entities/survey.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    @InjectRepository(SurveyFeedback)
    private surveyFeedbackRepository: Repository<SurveyFeedback>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}
  async createOne(
    createSurveyFeedbackDto: CreateSurveyFeedbackDto,
    member: Member,
    idQuestion: number,
  ) {
    const question = await this.questionRepository.findOne({
      where: { id: idQuestion },
      relations: ['survey'],
    });
    const survey = await this.surveyFeedbackRepository.create({
      ...createSurveyFeedbackDto,
      member,
      question,
      survey: question.survey,
    });
    await this.surveyRepository.save(survey);
    return {
      success: true,
      msg: 'Do survey successfully',
    };
  }
  async createMany(
    createSurveyFeedbackDto: CreateManySurveyFeedbackDto,
    member: Member,
    idSurvey: number,
  ) {
    const surveyFeedbacks = [];
    const survey = await this.surveyRepository.findOne({
      where: { id: idSurvey },
    });

    if (!survey)
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'SURVEY_NOT_FOUND');

    for (const answer of createSurveyFeedbackDto.listAnswers) {
      const question = await this.questionRepository.findOne({
        where: { id: answer.questionId },
        relations: ['survey'],
      });

      if (!question) {
        continue;
      }
      const surveyFeedback = this.surveyFeedbackRepository.create({
        answers: answer.response,
        member,
        question,
        survey: question.survey,
        formId: createSurveyFeedbackDto.formId,
      });

      const savedFeedback = await this.surveyFeedbackRepository.save(
        surveyFeedback,
      );
      delete savedFeedback.member;
      delete savedFeedback.question;
      delete savedFeedback.survey;
      surveyFeedbacks.push(savedFeedback);
    }
    return surveyFeedbacks;
  }

  async findAll() {
    return await this.surveyRepository.find({
      select: [
        'id',
        'name',
        'type',
        'status',
        'activeAt',
        'doneAt',
        'maxFeedback',
        'images',
      ],
    });
  }

  async findOne(id: number) {
    const survey = await this.surveyRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'type',
        'status',
        'activeAt',
        'doneAt',
        'maxFeedback',
        'images',
      ],
    });
    const questions = await this.questionRepository.find({
      where: { survey: { id: survey.id } },
    });
    return {
      survey,
      questions,
    };
  }
  async findRandomOne(id: number) {
    const survey = await this.surveyRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'type',
        'status',
        'activeAt',
        'doneAt',
        'maxFeedback',
        'images',
      ],
    });
    let questions = [];
    const permanentQuestion = await this.questionRepository.findOne({
      where: { survey: { id: survey.id }, isPermanent: true },
    });

    if (permanentQuestion) {
      questions.push(permanentQuestion);
    }

    const randomQuestions = await this.questionRepository
      .createQueryBuilder('question')
      .where('question.survey_id = :surveyId', { surveyId: survey.id })
      .andWhere('question.isPermanent = :isPermanent', { isPermanent: false })
      .orderBy('RANDOM()')
      .limit(3 - questions.length)
      .getMany();

    questions = questions.concat(randomQuestions);

    return {
      survey,
      questions,
    };
  }
}
