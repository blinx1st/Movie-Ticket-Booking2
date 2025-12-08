import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CinemaRoom } from '../showtimes/entities/cinema-room.entity';
import { CreateCinemaRoomDto } from './dto/create-showtime.dto';
import { UpdateCinemaRoomDto } from './dto/update-showtime.dto';

@Injectable()
export class CinemaRoomsService {
  constructor(
    @InjectRepository(CinemaRoom)
    private readonly cinemaRoomsRepository: Repository<CinemaRoom>,
  ) { }

  async create(createDto: CreateCinemaRoomDto): Promise<CinemaRoom> {
    const room = this.cinemaRoomsRepository.create({
      name: createDto.name,
      type: createDto.type ?? '2D (Phổ thông)',
      capacity: createDto.capacity ?? 0,
    });

    return this.cinemaRoomsRepository.save(room);
  }

  async findAll(): Promise<CinemaRoom[]> {
    return this.cinemaRoomsRepository.find();
  }

  async findOne(id: number): Promise<CinemaRoom> {
    const room = await this.cinemaRoomsRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Cinema room #${id} not found`);
    }
    return room;
  }

  async update(
    id: number,
    updateDto: UpdateCinemaRoomDto,
  ): Promise<CinemaRoom> {
    const room = await this.cinemaRoomsRepository.preload({
      id,
      ...updateDto, // có thể chứa capacity
    });

    if (!room) {
      throw new NotFoundException(`Cinema room #${id} not found`);
    }
    return this.cinemaRoomsRepository.save(room);
  }

  async remove(id: number): Promise<void> {
    const room = await this.findOne(id);
    await this.cinemaRoomsRepository.remove(room);
  }
}
