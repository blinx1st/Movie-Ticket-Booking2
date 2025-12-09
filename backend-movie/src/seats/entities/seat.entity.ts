import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  row: string; // Hàng A, B, C

  @Column()
  number: number; // Số 1, 2, 3

  @Column({ nullable: true })
  roomId?: number;

  @Column({ default: 'Standard' })
  type: string; // VIP, Standard
}
