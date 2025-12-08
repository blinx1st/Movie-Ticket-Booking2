import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ShowtimeDto {
  @ApiProperty({ example: 'Galaxy Central' })
  @IsString()
  cinema: string;

  @ApiProperty({ example: 'HCMC' })
  @IsString()
  city: string;

  @ApiProperty({ example: ['18:30', '21:00'] })
  @IsArray()
  @IsString({ each: true })
  times: string[];
}

export class CreateMovieDto {
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() slug?: string;
  @ApiProperty() @IsString() @IsNotEmpty() genre: string;
  @ApiProperty() @IsNumber() durationMinutes: number;
  @ApiProperty() @IsNumber() ticketPrice: number;
  @ApiProperty({ default: 'Now Showing' }) @IsString() status: string;
  @ApiProperty({ default: '2D' }) @IsString() format: string;
  @ApiProperty({ default: 0 }) @IsNumber() rating: number;
  @ApiProperty() @IsString() language: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsString() posterUrl: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() bannerUrl?: string;
  @ApiProperty() @IsDateString() releaseDate: Date;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() endDate?: Date;
  @ApiProperty({ required: false }) @IsOptional() @IsString() trailerUrl?: string;
  @ApiProperty({ required: false, type: [ShowtimeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShowtimeDto)
  showtimes?: ShowtimeDto[];
}
