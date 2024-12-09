import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { User } from 'submodules/entities';
import { SongService } from './song.service';
import { SendResponse } from 'submodules/common/response/send-response';
import { UpdateSongDto } from './dto/update-song.dto';
import { ReqUser } from 'submodules/common/decorators/user.decorator';

@ApiTags('Songs')
@Controller('v1/songs')
@ApiBearerAuth()
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get()
  @ApiOperation({ summary: 'Get all songs with filters' })
  async findAll(@Query() query: any, @Res() res: Response) {
    const [data, total] = await this.songService.findAll(query);
    return SendResponse.success(
      res,
      { data, total },
      'Admin: Songs retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get song details' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const song = await this.songService.findOne(+id);
    return SendResponse.success(
      res,
      song,
      'Admin: Song details retrieved successfully',
      HttpStatus.OK,
    );
  }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update song details' })
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateSongDto: UpdateSongDto,
  //   @ReqUser() admin: User,
  //   @Res() res: Response,
  // ) {
  //   const song = await this.songService.update(+id, updateSongDto, admin.id);
  //   return SendResponse.success(
  //     res,
  //     song,
  //     'Admin: Song updated successfully',
  //     HttpStatus.OK,
  //   );
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a song' })
  // async remove(
  //   @Param('id') id: string,
  //   @ReqUser() admin: User,
  //   @Res() res: Response,
  // ) {
  //   await this.songService.remove(+id, admin.id);
  //   return SendResponse.success(
  //     res,
  //     null,
  //     'Admin: Song deleted successfully',
  //     HttpStatus.OK,
  //   );
  // }
}
