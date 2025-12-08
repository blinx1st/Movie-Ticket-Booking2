import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CinemaRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên phòng (Ví dụ: "Phòng 01")

  @Column({ default: 'Standard' })
  type: string; // Loại phòng (Standard, IMAX, 3D...)

  @Column({ type: 'int', default: 0 })
  capacity: number; // Số ghế trong phòng
}