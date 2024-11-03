import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SignInDto {
	@ApiProperty({ example: 'nguyenybin2015@gmail.com' })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ example: '123456a@' })
	@IsString()
	@MinLength(8)
	@IsNotEmpty()
	password: string;

	constructor(email: string, password: string) {
		this.email = email;
		this.password = password;
	}
}
export class LogoutDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	deviceId: string;
}
export class SignUpDto {
  @ApiProperty({ example: 'nguyenybin2015@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456a@' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}