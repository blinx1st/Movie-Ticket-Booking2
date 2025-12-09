import { PartialType } from '@nestjs/swagger';
import { CreateCinemaRoomDto } from './create-showtime.dto';

export class UpdateCinemaRoomDto extends PartialType(CreateCinemaRoomDto) {}
