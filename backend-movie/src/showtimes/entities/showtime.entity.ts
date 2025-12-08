import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { CinemaRoom } from './cinema-room.entity'; // <-- Import Room

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: Date;

  // 👇 THAY ĐỔI: Bỏ roomName string, thay bằng quan hệ
  @ManyToOne(() => CinemaRoom)
  @JoinColumn({ name: 'roomId' })
  room: CinemaRoom;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;
}