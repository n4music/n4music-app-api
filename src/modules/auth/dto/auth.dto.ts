import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

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

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDate()
  @IsOptional()
  birthday?: Date;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  gender?: number;
}
