import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from 'submodules/entities/playlist.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    const playlist = this.playlistRepository.create(createPlaylistDto);
    return this.playlistRepository.save(playlist);
  }

  async findAll(): Promise<Playlist[]> {
    return this.playlistRepository.find();
  }

  async findOne(id: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({ where: { id } });
    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }
    return playlist;
  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto): Promise<Playlist> {
    const playlist = await this.findOne(id);
    Object.assign(playlist, updatePlaylistDto);
    return this.playlistRepository.save(playlist);
  }

  async remove(id: number): Promise<void> {
    const playlist = await this.findOne(id);
    await this.playlistRepository.remove(playlist);
  }
}