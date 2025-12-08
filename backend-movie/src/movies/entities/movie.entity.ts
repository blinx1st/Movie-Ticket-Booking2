import { PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn() id: number;
  @Column() title: string;
  @Column({ unique: true }) slug: string;
  @Column() genre: string;
  @Column() durationMinutes: number;
  @Column('decimal', { precision: 10, scale: 2 }) ticketPrice: number;
  @Column({ default: 'Now Showing' }) status: 'Now Showing' | 'Coming Soon';
  @Column({ default: '2D' }) format: '2D' | '3D' | 'IMAX' | '4DX';
  @Column({ default: 0 }) rating: number;
  @Column() language: string;
  @Column('text') description: string;
  @Column() posterUrl: string;
  @Column({ nullable: true }) bannerUrl: string;
  @Column('date') releaseDate: Date;
  @Column('date', { nullable: true }) endDate: Date;
  @Column({ nullable: true }) trailerUrl: string;
  @Column('json', { nullable: true }) showtimes: { cinema: string; city: string; times: string[] }[];
}