import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import Enum from 'submodules/common/constants';
import { BaseFilter } from 'submodules/common/dto/filter.dto';
import { enumToDescriptionArray } from 'submodules/common/helpers/helper';

export class GetListDto extends BaseFilter {
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({
    required: false,
    enum: Enum.Location.TYPE,
    description: enumToDescriptionArray(Enum.Location.TYPE_DESCRIPTION),
  })
  @Type(() => Number)
  @IsEnum(Enum.Location.TYPE)
  @IsOptional()
  type: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  parentId: number;

  @ApiProperty({
    required: false,
    enum: Enum.Location.LOCATION_KEY,
    description: enumToDescriptionArray(Enum.Location.LOCATION_KEY),
  })
  @IsEnum(Enum.Location.LOCATION_KEY)
  @IsOptional()
  key: string;
}
