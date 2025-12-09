import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import {
  ManualTransactionDto,
  UpdateTransactionDto,
} from './dto/manual-transaction.dto';

@Injectable()
export class RevenueService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async getSummary(from?: string, to?: string) {
    const qb = this.bookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalAmount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('booking.status != :status', { status: 'Cancelled' });
    if (from) qb.andWhere('booking.bookingDate >= :from', { from });
    if (to) qb.andWhere('booking.bookingDate <= :to', { to });
    const result = await qb.getRawOne();
    return {
      totalRevenue: parseFloat(result.total) || 0,
      totalCount: parseInt(result.count) || 0,
    };
  }

  async getUniqueUserCount() {
    const result = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('COUNT(DISTINCT booking.userId)', 'count')
      .getRawOne();
    return { totalUsersBooked: parseInt(result.count) || 0 };
  }

  async listTransactions(status?: string, from?: string, to?: string, userId?: string) {
    const qb = this.bookingRepository
      .createQueryBuilder('booking')
      .orderBy('booking.bookingDate', 'DESC');
    if (status) qb.andWhere('booking.status = :status', { status });
    if (from) qb.andWhere('booking.bookingDate >= :from', { from });
    if (to) qb.andWhere('booking.bookingDate <= :to', { to });
    if (userId) qb.andWhere('booking.userId = :userId', { userId });
    return qb.getMany();
  }

  async createTransaction(dto: ManualTransactionDto) {
    const booking = this.bookingRepository.create({
      totalAmount: Number(dto.amount),
      status: dto.status || 'Paid',
      paymentMethod: dto.paymentMethod || 'Manual',
      userId: dto.userId,
      movieId: dto.movieId,
      showtimeId: dto.showtimeId,
      source: dto.source || 'manual',
      note: dto.note,
      tickets: [],
    });
    return this.bookingRepository.save(booking);
  }

  async updateTransaction(id: number, dto: UpdateTransactionDto) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) throw new Error('Transaction not found');
    this.bookingRepository.merge(booking, {
      totalAmount:
        dto.amount !== undefined ? Number(dto.amount) : booking.totalAmount,
      status: dto.status ?? booking.status,
      paymentMethod: dto.paymentMethod ?? booking.paymentMethod,
      note: dto.note ?? booking.note,
      source: dto.source ?? booking.source,
      userId: dto.userId ?? booking.userId,
      movieId: dto.movieId ?? booking.movieId,
      showtimeId: dto.showtimeId ?? booking.showtimeId,
    });
    return this.bookingRepository.save(booking);
  }

  async removeTransaction(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) throw new Error('Transaction not found');
    await this.bookingRepository.remove(booking);
    return { message: 'Deleted' };
  }
}
