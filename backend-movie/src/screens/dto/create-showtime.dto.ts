import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCinemaRoomDto {
    @ApiProperty({ example: '1', description: 'Tên hoặc số phòng chiếu' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '2D (Phổ thông)',
        description: 'Loại phòng: 2D (Phổ thông), IMAX 2D, IMAX 3D, IMAX Dome, Dolby Cinema, RPX...',
        required: false,
    })
    @IsString()
    @IsOptional()
    type?: string;          // 👈 chỉ cần type?: string

    @ApiProperty({ example: 50, description: 'Sức chứa (số ghế)' })
    @IsInt()
    @Min(0)
    capacity: number;
}
