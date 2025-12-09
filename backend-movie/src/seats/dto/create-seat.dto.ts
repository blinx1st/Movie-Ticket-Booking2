import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSeatDto {
  @ApiProperty() @IsString() @IsNotEmpty() row: string;
  @ApiProperty() @IsNumber() number: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() type?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() roomId?: number;
}
