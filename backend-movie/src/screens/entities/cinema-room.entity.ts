import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CinemaRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên phòng

  @Column({ default: '2D (Phổ thông)' })
  type: string; // Loại phòng chiếu: 2D, IMAX 3D,...

  @Column({ type: 'int', default: 0 })
  capacity: number; // Số ghế
}
