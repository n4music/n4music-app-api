import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Response } from 'express';
import { SendResponse } from 'submodules/common/response/send-response';

@ApiTags('Playlist')
@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new playlist' })
  @ApiResponse({ status: 201, description: 'The playlist has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createPlaylistDto: CreatePlaylistDto, @Res() res: Response) {
    const playlist = this.playlistService.create(createPlaylistDto);
    return SendResponse.success(res, playlist, 'The playlist has been successfully created.', 201);
  }

  @Get()
  @ApiOperation({ summary: 'Get all playlists' })
  @ApiResponse({ status: 200, description: 'Return all playlists.' })
  findAll(@Res() res: Response) {
    const playlists = this.playlistService.findAll();
    return SendResponse.success(res, playlists, 'Return all playlists.', 200);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a playlist by ID' })
  @ApiResponse({ status: 200, description: 'Return the playlist.' })
  @ApiResponse({ status: 404, description: 'Playlist not found.' })
  findOne(@Param('id') id: string, @Res() res: Response) {
    const playlist = this.playlistService.findOne(+id);
    return SendResponse.success(res, playlist, 'Return the playlist.', 200);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a playlist by ID' })
  @ApiResponse({ status: 200, description: 'The playlist has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Playlist not found.' })
  update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto, @Res() res: Response) {
    const playlist = this.playlistService.update(+id, updatePlaylistDto);
    return SendResponse.success(res, playlist, 'The playlist has been successfully updated.', 200);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a playlist by ID' })
  @ApiResponse({ status: 200, description: 'The playlist has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Playlist not found.' })
  remove(@Param('id') id: string, @Res() res: Response) {
    this.playlistService.remove(+id);
    return SendResponse.success(res, null, 'The playlist has been successfully deleted.', 200);
  }
}