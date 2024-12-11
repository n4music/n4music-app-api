import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({ description: 'Name of the artist' })
  name: string;

  @ApiProperty({ description: 'Description of the artist' })
  description: string;

  @ApiProperty({ description: 'Status of the artist' })
  status: number;

  @ApiProperty({ description: 'Metadata of the artist', type: Object })
  meta: object;
}