import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';

@Injectable()
export class RevenueService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  // Hàm 1: Tính tổng doanh thu
  async getTotalRevenue() {
    const result = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalAmount)', 'total')
      .where("booking.status = :status", { status: 'Paid' })
      .getRawOne();
    
    return { totalRevenue: parseFloat(result.total) || 0 };
  }

  // Hàm 2: Đếm số lượng User (ĐÂY LÀ HÀM BẠN ĐANG THIẾU)
  async getUniqueUserCount() {
    const result = await this.bookingRepository
      .createQueryBuilder('booking')
      // Đếm số lượng userId khác nhau (DISTINCT)
      .select('COUNT(DISTINCT booking.userId)', 'count') 
      .getRawOne();

    return { totalUsersBooked: parseInt(result.count) || 0 };
  }
}