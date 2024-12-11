import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Response } from 'express';
import { SendResponse } from 'submodules/common/response/send-response';
import { ErrorHttpException } from 'submodules/common/exceptions/throw.exception';

@ApiTags('Artists')
@Controller('artists')
@ApiBearerAuth()
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @ApiOperation({ summary: 'Create a new artist' })
  @Post()
  async create(@Body() createArtistDto: CreateArtistDto, @Res() res: Response) {
    const data = await this.artistService.create(createArtistDto);
    return SendResponse.success(res, data, 'Artist created successfully', 201);
  }

  @ApiOperation({ summary: 'Get all artists' })
  @Get()
  async findAll(@Query() query: any, @Res() res: Response) {
    const data = await this.artistService.findAll(query);
    return SendResponse.success(res, data, 'Artists retrieved successfully', 200);
  }

  @ApiOperation({ summary: 'Get an artist by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const data = await this.artistService.findOne(+id);
    if (!data) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'ARTIST_NOT_FOUND');
    }
    return SendResponse.success(res, data, 'Artist retrieved successfully', 200);
  }

  @ApiOperation({ summary: 'Update an artist by ID' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto, @Res() res: Response) {
    const data = await this.artistService.update(+id, updateArtistDto);
    return SendResponse.success(res, data, 'Artist updated successfully', 200);
  }

  @ApiOperation({ summary: 'Delete an artist by ID' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.artistService.remove(+id);
    return SendResponse.success(res, null, 'Artist deleted successfully', 200);
  }
}