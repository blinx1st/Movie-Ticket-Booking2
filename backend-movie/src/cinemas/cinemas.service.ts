import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from './entities/cinema.entity';
import { CreateCinemaDto, UpdateCinemaDto } from './dto/create-cinema.dto';

@Injectable()
export class CinemasService {
  constructor(
    @InjectRepository(Cinema)
    private readonly cinemaRepo: Repository<Cinema>,
  ) {}

  create(dto: CreateCinemaDto) {
    const cinema = this.cinemaRepo.create(dto);
    return this.cinemaRepo.save(cinema);
  }

  findAll() {
    return this.cinemaRepo.find();
  }

  async findOne(id: number) {
    const cinema = await this.cinemaRepo.findOne({ where: { id } });
    if (!cinema) throw new NotFoundException('Cinema not found');
    return cinema;
  }

  async update(id: number, dto: UpdateCinemaDto) {
    const cinema = await this.findOne(id);
    this.cinemaRepo.merge(cinema, dto);
    return this.cinemaRepo.save(cinema);
  }

  async remove(id: number) {
    const result = await this.cinemaRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Cinema not found');
    return { message: 'Deleted successfully' };
  }
}
