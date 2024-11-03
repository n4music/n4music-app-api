import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqMember } from 'submodules/common/decorators/user.decorator';
import { Member } from 'submodules/entities';
import { CreateManySurveyFeedbackDto } from './dto/create-survey.dto';
import { SurveyService } from './survey.service';
import { Response } from 'express';
import { SendResponse } from 'submodules/common/response/send-response';
@ApiTags('Survey')
@Controller('v1/survey')
@ApiBearerAuth()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}
  @ApiOperation({
    summary: 'Tạo nhiều câu trả lời',
  })
  @Post(':idSurvey')
  async createMany(
    @ReqMember() member: Member,
    @Body() createSurveyFeedbackDto: CreateManySurveyFeedbackDto,
    @Param('idSurvey') idSurvey: number,
    @Res() res: Response,
  ) {
    const data = await this.surveyService.createMany(
      createSurveyFeedbackDto,
      member,
      +idSurvey,
    );
    return SendResponse.success(res, data, 'Tạo câu trả lời thành công', 201);
  }

  @ApiOperation({
    summary: 'Lấy toàn bộ khảo sát',
  })
  @Get('')
  find() {
    return this.surveyService.findAll();
  }

  @ApiOperation({
    summary: 'Chi tiết khảo sát',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveyService.findOne(+id);
  }
  @ApiOperation({
    summary: 'Lấy câu hỏi khảo sát',
  })
  @Get(':id/random')
  findRandomOne(@Param('id') id: string) {
    return this.surveyService.findRandomOne(+id);
  }
}
