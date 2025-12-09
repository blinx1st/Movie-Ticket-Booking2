import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() userId?: string;
  @ApiProperty() @IsNumber() showtimeId: number;
  @ApiProperty() @IsNumber() movieId: number;
  @ApiProperty({ type: [Number] }) @IsArray() seatIds: number[];
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentRef?: string;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() note?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() source?: string;
}
