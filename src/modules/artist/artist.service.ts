import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from 'submodules/entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import FilterBuilder from 'submodules/common/builder/filter.builder';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistRepository.create(createArtistDto);
    return await this.artistRepository.save(artist);
  }

  async findAll(query?: any) {
    const filterBuilder = new FilterBuilder<Artist>({
      entityRepo: this.artistRepository,
      alias: 'artists',
    })
      .select(['id', 'name', 'description', 'status', 'meta'])
      .addPagination(query?.page, query?.perPage);

    if (query?.name) {
      filterBuilder.addUnAccentString('name', query.name);
    }

    if (query?.status) {
      filterBuilder.addNumber('status', query.status);
    }

    return await filterBuilder.getManyAndCount();
  }

  async findOne(id: number): Promise<Artist> {
    const artist = await this.artistRepository.findOne({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  async update(
    id: number,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    const artist = await this.findOne(id);
    Object.assign(artist, updateArtistDto);
    return await this.artistRepository.save(artist);
  }

  async remove(id: number): Promise<void> {
    const artist = await this.findOne(id);
    await this.artistRepository.remove(artist);
  }
}