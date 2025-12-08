import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepo: Repository<Showtime>,
  ) {}

  async create(dto: CreateShowtimeDto) {
    const showtime = this.showtimeRepo.create({
      ...dto,
      movieId: Number(dto.movieId),
      price: Number(dto.price ?? 0),
      times: dto.times ?? [],
    } as any);
    return this.showtimeRepo.save(showtime);
  }

  async findAll(movieId?: number) {
    const qb = this.showtimeRepo.createQueryBuilder('showtime').orderBy('showtime.startTime', 'ASC');
    if (movieId) qb.where('showtime.movieId = :movieId', { movieId: Number(movieId) });
    return qb.getMany();
  }

  async findOne(id: number) {
    const showtime = await this.showtimeRepo.findOne({ where: { id } });
    if (!showtime) throw new NotFoundException('Showtime not found');
    return showtime;
  }

  async update(id: number, dto: UpdateShowtimeDto) {
    const showtime = await this.findOne(id);
    this.showtimeRepo.merge(showtime, {
      ...dto,
      movieId: dto.movieId ? Number(dto.movieId) : showtime.movieId,
      price: dto.price !== undefined ? Number(dto.price) : showtime.price,
      times: dto.times ?? showtime.times,
    } as any);
    return this.showtimeRepo.save(showtime);
  }

  async remove(id: number) {
    const result = await this.showtimeRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Showtime not found');
    return { message: 'Deleted successfully' };
  }
}
