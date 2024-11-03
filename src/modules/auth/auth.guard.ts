import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import * as fs from 'fs';
import moment from 'moment';
import Enum from 'submodules/common/constants';
import { IS_PUBLIC_KEY } from 'submodules/common/decorators/public.decorator';
import { ErrorException } from 'submodules/common/response/error-payload.dto';
import { cfg } from 'submodules/config/env.config';
import { Member, SystemConfig } from 'submodules/entities';
import { Logger } from 'submodules/logger/logger.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly logger: Logger,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(SystemConfig)
    private readonly systemConfigRepository: Repository<SystemConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const systemConfig = await this.systemConfigRepository.findOneBy({
      type: Enum.SystemConfig.TYPE.SYSTEM_INFORMATION,
    });
    if (systemConfig.data.systemMaintenance) {
      throw new ErrorException(
        HttpStatus.SERVICE_UNAVAILABLE,
        503,
        'Config',
        'Hệ thống đang bảo trì, Vui lòng thử lại sau',
      );
    }

    const releasedAt = moment(systemConfig.data.releasedAt);
    if (new Date() < releasedAt.toDate()) {
      throw new ErrorException(
        HttpStatus.SERVICE_UNAVAILABLE,
        503,
        'Config',
        `Ops! Bạn vui lòng quay lại vào ngày ${releasedAt.format(
          'DD-MM-YYYY',
        )}}`,
      );
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.error(`[authentication] - Not found token`);
      throw new ErrorException(
        HttpStatus.UNAUTHORIZED,
        401,
        'AuthGuard',
        'Not found token',
      );
    }
    try {
      const pubCert = fs.readFileSync(cfg('JWT_PUBLIC_KEY'));

      const payload = await this.jwtService.verifyAsync(token, {
        publicKey: pubCert,
      });

      const member = await this.memberRepository
        .createQueryBuilder('member')
        .addSelect(['member.password', 'member.tokenInfo'])
        .where('member.id = :id', { id: payload.id })
        .getOne();

      if (!member) {
        throw new ErrorException(
          HttpStatus.UNAUTHORIZED,
          401,
          'Authentication Error',
          'payload ',
        );
      }
      if (member.tokenInfo?.app !== token) {
        throw new ErrorException(
          HttpStatus.UNAUTHORIZED,
          401,
          'Authentication Error',
          'token',
        );
      }
      delete member.tokenInfo;
      delete member.images;
      delete member.password;

      request['state'] = { member: member, systemConfig: systemConfig };
    } catch (error) {
      this.logger.error(
        `[authentication] # Authentication Error # ${
          error.response?.details || error.message
        }`,
      );
      throw new ErrorException(
        HttpStatus.UNAUTHORIZED,
        401,
        'Authentication Error',
        'Invalid token',
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
