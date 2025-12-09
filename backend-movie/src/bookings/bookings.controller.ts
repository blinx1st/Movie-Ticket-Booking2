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
import { CreateBookingDto, UpdateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('checkout')
  @Public()
  checkout(@Body() dto: CreateBookingDto) {
    return this.bookingsService.checkout(dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.bookingsService.findAll(status);
  }

  @Get('me')
  @Public()
  findMine(@Query('userId') userId?: string) {
    if (!userId) return [];
    return this.bookingsService.findMine(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
