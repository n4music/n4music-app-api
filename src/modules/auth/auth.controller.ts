import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { Public } from 'submodules/common/decorators/public.decorator';
import { ReqMember } from 'submodules/common/decorators/user.decorator';
import { Member } from 'submodules/entities';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
	constructor(
		private authService: AuthService,
	) {}

	@Public()
	@Post('sign-in')
	async signIn(@Body() signInDto: SignInDto) {
		const result = await this.authService.signIn(signInDto);
		return result;
	}
	@ApiBearerAuth()
	@Post('logout')
	async logout(@ReqMember() member: Member) {
		await this.authService.deleteToken(member);
		return {
			success: true,
			msg: 'Logged out successfully',
		};
	}

	@Post('sign-up')
	@Public()
	async signUp(@Body() signUpDto: SignUpDto) {
		const result = await this.authService.signUp(signUpDto);
		return result;
	}
}
