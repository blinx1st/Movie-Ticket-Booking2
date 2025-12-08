import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookSeatDto {
  @ApiProperty({ example: 1, description: 'ID người dùng' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 101, description: 'ID suất chiếu' })
  @IsNotEmpty()
  @IsNumber()
  showtimeId: number;

  @ApiProperty({ example: 1, description: 'ID phim để tính giá' })
  @IsNotEmpty()
  @IsNumber()
  movieId: number;

  @ApiProperty({ example: [1, 2], description: 'Danh sách ID ghế muốn đặt', type: [Number] })
  @IsArray()
  @IsNotEmpty()
  seatIds: number[];
}

