import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CreateCinemaRoomDto } from './dto/create-showtime.dto';
import { UpdateCinemaRoomDto } from './dto/update-showtime.dto';
import { CinemaRoomsService } from './cinema-room.service';

@Controller('cinema-rooms')
export class CinemaRoomsController {
  constructor(private readonly cinemaRoomsService: CinemaRoomsService) { }

  @Post()
  create(@Body() createDto: CreateCinemaRoomDto) {
    return this.cinemaRoomsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.cinemaRoomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cinemaRoomsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCinemaRoomDto,
  ) {
    return this.cinemaRoomsService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cinemaRoomsService.remove(+id);
  }
}
