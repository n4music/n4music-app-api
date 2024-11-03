import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Location,
  Mediafile,
  Member,
  MemberLog,
} from 'submodules/entities';

import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      MemberLog,
      Location,
      Mediafile,
    ]),
  ],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
