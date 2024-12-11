import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from 'submodules/entities';
import FilterBuilder from 'submodules/common/builder/filter.builder';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async findAll(query?: any) {
    const filterBuilder = new FilterBuilder<Song>({
      entityRepo: this.songRepository,
      alias: 'songs',
    })
      .select(['id', 'name', 'description', 'avatar', 'type', 'status', 'meta'])
      .addPagination(query?.page, query?.perPage);

    // Add relationships
    filterBuilder.queryBuilder.leftJoinAndSelect('songs.artist', 'artist');

    // Admin specific filters
    if (query?.name) {
      filterBuilder.addUnAccentString('name', query.name);
    }

    if (query?.type) {
      filterBuilder.addNumber('type', query.type);
    }

    if (query?.status) {
      filterBuilder.addNumber('status', query.status);
    }

    if (query?.artistId) {
      filterBuilder.addNumber('artist_id', query.artistId, 'songs');
    }

    return await filterBuilder.getManyAndCount();
  }

  async findOne(id: number): Promise<Song> {
    const song = await this.songRepository.findOne({
      where: { id },
      relations: ['artist'],
    });

    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    return song;
  }

  async update(
    id: number,
    updateSongDto: UpdateSongDto,
    adminId: number,
  ): Promise<Song> {
    const song = await this.findOne(id);
    Object.assign(song, {
      ...updateSongDto,
      updated_by: adminId,
    });
    return await this.songRepository.save(song);
  }

  async remove(id: number, adminId: number): Promise<void> {
    const song = await this.findOne(id);
    // Optional: Add soft delete instead of hard delete
    // song.deleted_by = adminId;
    // song.deleted_at = new Date();
    await this.songRepository.save(song);
    // await this.songRepository.remove(song); // Hard delete
  }
}
