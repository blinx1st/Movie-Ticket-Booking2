import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])], // <-- QUAN TRỌNG: Đăng ký Movie Entity
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}