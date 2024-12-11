import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsObject } from 'class-validator';

export class CreatePlaylistDto {
  @ApiProperty({ description: 'Name of the playlist', example: 'My Playlist' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the playlist', example: 'This is my favorite playlist' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Avatar URL of the playlist', example: 'http://example.com/avatar.png' })
  @IsString()
  avatar: string;

  @ApiProperty({ description: 'ID of the member who created the playlist', example: 1 })
  @IsNumber()
  @Type(() => Number)
  memberId: number;

  @ApiProperty({ description: 'Metadata of the playlist', example: { genre: 'Pop' } })
  @IsObject()
  meta: object;
}