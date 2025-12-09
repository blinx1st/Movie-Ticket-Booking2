import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from 'src/decorator/customize';
import {
  CreateShowtimeDto,
  UpdateShowtimeDto,
} from './dto/create-showtime.dto';
import { ShowtimesService } from './showtimes.service';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  create(@Body() dto: CreateShowtimeDto) {
    return this.showtimesService.create(dto);
  }

  @Get()
  @Public()
  findAll(
    @Query('movieId') movieId?: string,
    @Query('cinemaId') cinemaId?: string,
    @Query('date') date?: string,
  ) {
    return this.showtimesService.findAll(
      movieId ? +movieId : undefined,
      cinemaId ? +cinemaId : undefined,
      date,
    );
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateShowtimeDto) {
    return this.showtimesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showtimesService.remove(+id);
  }
}
