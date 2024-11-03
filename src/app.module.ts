import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationModule } from 'modules/location/location.module';
import { MemberModule } from 'modules/member/member.module';
import { SurveyModule } from 'modules/survey/survey.module';
import { Member, SystemConfig } from 'submodules/entities';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './data-source.config';
import { HealthCheckerModule } from './submodules/health-checker/health-checker.module';
import { LoggerModule } from './submodules/logger/logger.module';
import { Logger } from './submodules/logger/logger.service';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
      logger: new Logger(),
    }),
    TypeOrmModule.forFeature([Member, SystemConfig]),
    LoggerModule,
    HealthCheckerModule,
    AuthModule,
    MemberModule,
    SurveyModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
