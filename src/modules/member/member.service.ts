import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'submodules/common/builder/filter.builder';
import { TransactionBuilder } from 'submodules/common/builder/transaction.builder';
import {
  RenderLogBuilder,
  UpdateBuilder,
} from 'submodules/common/builder/update.builder';
import Enum from 'submodules/common/constants';
import { ErrorHttpException } from 'submodules/common/exceptions/throw.exception';
import { listResponse } from 'submodules/common/response/response-list.response';
import {
  Location,
  Mediafile,
  Member,
  MemberLog,
} from 'submodules/entities';
import { DataSource, Repository } from 'typeorm';
import { GetListFormDto, UpdateMemberDto } from './dto/member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(MemberLog)
    private memberLogRepository: Repository<MemberLog>,
    @InjectRepository(Mediafile)
    private mediafileRepository: Repository<Mediafile>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getDetail(id: number) {
    const filterBuilder = new FilterBuilder({
      entityRepo: this.memberRepository,
      alias: 'members',
    }).addNumber('id', id);
    const member = await filterBuilder.queryBuilder.getOne();
    return {
      member,
    };
  }

  async update(updateDto: UpdateMemberDto, memberId: number) {
    const member = await this.memberRepository.findOneBy({ id: memberId });
    if (!member) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'MEMBER_NOT_FOUND');
    }
    const renderLogBuilder = new RenderLogBuilder(
      this.memberLogRepository,
      member,
    );

    const updateBuilder = new UpdateBuilder(member, updateDto, renderLogBuilder)
      .update('name')
      .update('birthday')
      .update('cityId')
      .update('email')
      .update('avatarId');

    // if (updateDto.name) {
    //   const resultCheckName = isValidVietnameseName(updateDto.name);
    //   if (!resultCheckName)
    //     throw ErrorHttpException(
    //       HttpStatus.BAD_REQUEST,
    //       'MEMBER_NAME_NOT_VALID',
    //     );
    // }
    if (updateDto.deliveryInfo?.cityId) {
      const cityName = await this.getLocationName(
        updateDto.deliveryInfo?.cityId,
        Enum.Location.TYPE.CITY,
      );
      updateBuilder.dataUpdate.deliveryInfo.cityName = cityName;
    }
    if (updateDto.deliveryInfo?.districtId) {
      const districtName = await this.getLocationName(
        updateDto.deliveryInfo?.districtId,
        Enum.Location.TYPE.DISTRICT,
      );
      updateBuilder.dataUpdate.deliveryInfo.districtName = districtName;
    }
    if (updateDto.deliveryInfo?.wardId) {
      const wardName = await this.getLocationName(
        updateDto.deliveryInfo?.wardId,
        Enum.Location.TYPE.WARD,
      );
      updateBuilder.dataUpdate.deliveryInfo.wardName = wardName;
    }
    if (updateDto.avatarId) {
      const mediafile = await this.mediafileRepository.findOneBy({
        id: updateDto.avatarId,
      });
      if (!mediafile) {
        throw ErrorHttpException(HttpStatus.NOT_FOUND, `MEDIA_FILE_NOT_FOUND`);
      }
      updateBuilder.dataUpdate.images = {
        ...member.images,
        avatar: {
          ...mediafile.variants,
          original: {
            id: mediafile.id,
            size: mediafile.size,
          },
        },
      };
    }

    const transactionBuilder = new TransactionBuilder(this.dataSource);
    await transactionBuilder.startTransaction();
    try {
      //update data
      await this.memberRepository
        .createQueryBuilder('member', transactionBuilder.queryRunner)
        .update()
        .set(updateBuilder.dataUpdate)
        .where({ id: member.id })
        .execute();
      //write logs
      await renderLogBuilder.insert(member.id, transactionBuilder.queryRunner);
      //commit transaction
      await transactionBuilder.commitTransaction();
      return {
        success: true,
      };
    } catch (error) {
      await transactionBuilder.rollbackTransaction();
      throw ErrorHttpException(HttpStatus.INTERNAL_SERVER_ERROR, 'BACKEND');
    } finally {
      await transactionBuilder.release();
    }
  }

  async getLocationName(locationId: number, type: number) {
    const location = await this.locationRepository.findOneBy({
      id: locationId,
      type: type,
    });
    if (!location) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'LOCATION_NOT_FOUND');
    }
    return location.name;
  }
}
