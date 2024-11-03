import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseFilter } from 'submodules/common/dto/filter.dto';
export class UpdateDeliveryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, example: '0386516874' })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  cityId: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  districtId: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  wardId: number;
}
export class UpdateMemberDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({ required: false, example: '0386516874' })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ required: true })
  @IsDateString()
  @IsOptional()
  birthday: Date;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  cityId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  avatarId: string;

  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => UpdateDeliveryDto)
  @IsOptional()
  deliveryInfo: UpdateDeliveryDto;
}
export class GetListFormDto extends BaseFilter {}
