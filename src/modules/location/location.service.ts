import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'submodules/common/builder/filter.builder';
import Enum from 'submodules/common/constants';
import { listResponse } from 'submodules/common/response/response-list.response';
import { Location } from 'submodules/entities';
import { Repository } from 'typeorm';
import { GetListDto } from './dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}
  public async getList(getListDto: GetListDto) {
    const entity = {
      entityRepo: this.locationRepository,
      alias: 'location',
    };
    const filterBuilder = new FilterBuilder<Location, GetListDto>(
      entity,
      getListDto,
    )
      .andWhere('key', Enum.Location.LOCATION_KEY.vietnam)
      .andWhere('parentId')
      .andWhere('type')
      .andWhere('id')
      .addPagination();

    const [data, total] = await filterBuilder.queryBuilder.getManyAndCount();
    return listResponse(data, total, getListDto);
  }

  public async getDetail(id: number) {
    const filterBuilder = new FilterBuilder({
      entityRepo: this.locationRepository,
      alias: 'location',
    })
      .andWhere('key', Enum.Location.LOCATION_KEY.vietnam)
      .andWhere('id', id)
      .addPagination();

    return await filterBuilder.queryBuilder.getOne();
  }
}
