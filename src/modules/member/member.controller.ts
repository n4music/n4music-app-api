import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqMember } from 'submodules/common/decorators/user.decorator';
import { ErrorHttpException } from 'submodules/common/exceptions/throw.exception';
import { Member } from 'submodules/entities';
import { GetListFormDto, UpdateMemberDto } from './dto/member.dto';
import { MemberService } from './member.service';
import { Response } from 'express';
import { SendResponse } from 'submodules/common/response/send-response';
@ApiTags('Member')
@Controller('v1/members')
@ApiBearerAuth()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('me')
  async getMe(@ReqMember() member: Member,  @Res() res: Response) {
    const data = await this.memberService.getDetail(member.id);
    if (!data) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'MEMBER_NOT_FOUND');
    }
    return SendResponse.success(
      res,
      data,
      'Lấy thông tin thành công!',
      200,
    );
  }
  @Put('me')
  async update(
    @Body() updateDto: UpdateMemberDto,
    @ReqMember() member: Member,
    @Res() res: Response
  ) {
    const data = await this.memberService.update(updateDto, member.id);
    return SendResponse.success(
      res,
      data,
      'Cập nhật thông tin thành công!',
      200,
    );
  }
}
