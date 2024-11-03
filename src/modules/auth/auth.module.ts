import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { Member, SystemConfig } from 'submodules/entities';
import { Logger } from 'submodules/logger/logger.service';

@Global()
@Module({
	imports: [
		JwtModule,
		TypeOrmModule.forFeature([Member, SystemConfig]),
	],
	controllers: [AuthController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		AuthService,
		AuthGuard,
		Logger,
	],
	exports: [AuthGuard, AuthService],
})
export class AuthModule {}
