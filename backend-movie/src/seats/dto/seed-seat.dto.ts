import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class SeedSeatDto {
  @ApiProperty() @IsNumber() roomId: number;
  @ApiProperty({ type: [String], example: ['A:8', 'B:8'] })
  @IsArray()
  @IsNotEmpty()
  rows: string[]; // format "A:8"
}
