import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const slug = createMovieDto.slug || this.buildSlug(createMovieDto.title);
    const movie = this.movieRepository.create({ ...createMovieDto, slug } as any);
    return this.movieRepository.save(movie);
  }

  async findAll(status?: string, limit?: number, page?: number) {
    const qb = this.movieRepository.createQueryBuilder('movie').orderBy('movie.id', 'DESC');
    if (status) qb.andWhere('movie.status = :status', { status });
    if (limit) {
      qb.take(limit);
      if (page) qb.skip((page - 1) * limit);
    }
    return qb.getMany();
  }

  async findOne(slugOrId: string | number) {
    const where =
      typeof slugOrId === 'number' || /^\d+$/.test(String(slugOrId))
        ? { id: Number(slugOrId) }
        : { slug: String(slugOrId) };
    const movie = await this.movieRepository.findOne({ where });
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.findOne(id);
    const slug = updateMovieDto.slug || this.buildSlug(updateMovieDto.title || movie.title);
    this.movieRepository.merge(movie, { ...updateMovieDto, slug } as any);
    return this.movieRepository.save(movie);
  }

  async remove(id: number) {
    const result = await this.movieRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Movie not found');
    return { message: 'Deleted successfully' };
  }

  private buildSlug(text: string) {
    return (text || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
