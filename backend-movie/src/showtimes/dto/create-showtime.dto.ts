import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateShowtimeDto {
  @ApiProperty() @IsNumber() movieId: number;
  @ApiProperty() @IsNumber() cinemaId: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() cinema?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty() @IsNumber() roomId: number;
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  times: string[];
  @ApiProperty() @IsDateString() startTime: Date;
  @ApiProperty() @IsNumber() price: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() room?: string;
}

export class UpdateShowtimeDto extends PartialType(CreateShowtimeDto) {}
