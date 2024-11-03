import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'submodules/common/decorators/public.decorator';
import { SendResponse } from 'submodules/common/response/send-response';
import { GetListDto } from './dto';
import { LocationService } from './location.service';
import { Response } from 'express';

@ApiTags('Location')
@Controller('v1/locations')
@Public()
export class LocationController {
  constructor(private locationService: LocationService) {}

  @ApiOperation({
    summary: 'Danh sách Location',
    description: ``,
  })
  @Get('')
  async getList(@Query() getListDto: GetListDto, @Res() res: Response) {
    const locations = await this.locationService.getList(getListDto);
    return SendResponse.success(
      res,
      locations,
      'Lấy danh sách location thành công!',
      200,
    );
  }
}
