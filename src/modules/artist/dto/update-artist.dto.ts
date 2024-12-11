import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArtistDto {
  @ApiPropertyOptional({ description: 'Name of the artist' })
  name?: string;

  @ApiPropertyOptional({ description: 'Description of the artist' })
  description?: string;

  @ApiPropertyOptional({ description: 'Status of the artist' })
  status?: number;

  @ApiPropertyOptional({ description: 'Metadata of the artist' })
  meta?: object;
}