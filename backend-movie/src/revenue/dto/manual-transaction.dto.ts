import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ManualTransactionDto {
  @ApiProperty({ example: 120000 }) @IsNumber() amount: number;
  @ApiProperty({ required: false, example: 'Paid' })
  @IsOptional()
  @IsString()
  status?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() userId?: string; // string to align with user Mongo _id
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() movieId?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  showtimeId?: number;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() note?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() source?: string;
}

export class UpdateTransactionDto extends PartialType(ManualTransactionDto) {}
