import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Seat } from './entities/seat.entity';
import { Ticket } from './entities/ticket.entity';
import { Booking } from '../revenue/entities/booking.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
  ) {}

  // 1. LẤY TRẠNG THÁI GHẾ
  async getSeatsStatus(showtimeId: number) {
    const showtime = await this.showtimeRepository.findOne({
      where: { id: showtimeId },
    });
    if (!showtime) {
      throw new NotFoundException('Suất chiếu không tồn tại!');
    }

    const allSeats = await this.seatRepository.find({
      where: showtime.roomId ? { roomId: showtime.roomId } : {},
    });

    const soldTickets = await this.ticketRepository.find({
      where: { showtimeId: showtimeId },
      relations: ['seat'],
    });

    const soldSeatIds = new Set(soldTickets.map((t) => t.seat.id));

    return allSeats.map((seat) => ({
      ...seat,
      isBooked: soldSeatIds.has(seat.id),
    }));
  }

  // 2. ĐẶT GHẾ VÀ TÍNH TIỀN (Logic Full: Phim + Phòng + Giờ chiếu)
  async bookSeats(
    userId: string | number,
    showtimeId: number,
    movieId: number,
    seatIds: number[],
  ) {
    // B1: KIỂM TRA SUẤT CHIẾU & PHÒNG CHIẾU
    // Chúng ta cần join bảng 'movie' và 'room' để lấy thông tin chi tiết
    const showtime = await this.showtimeRepository.findOne({
      where: { id: showtimeId },
    });

    if (!showtime) {
      throw new NotFoundException('Suất chiếu không tồn tại!');
    }

    // Validate: Suất chiếu này có đúng là đang chiếu phim khách chọn không?
    if (showtime.movieId !== movieId) {
      throw new BadRequestException(
        'Dữ liệu không khớp: Suất chiếu này không chiếu bộ phim bạn chọn!',
      );
    }

    // B2: LẤY THÔNG TIN GHẾ
    const selectedSeats = await this.seatRepository.find({
      where: { id: In(seatIds) },
    });

    if (showtime.roomId) {
      const invalidSeat = selectedSeats.find(
        (s) => s.roomId && s.roomId !== showtime.roomId,
      );
      if (invalidSeat) {
        throw new BadRequestException('Ghế không thuộc phòng của suất chiếu.');
      }
    }

    if (selectedSeats.length !== seatIds.length) {
      throw new BadRequestException('Một số ghế bạn chọn không tồn tại.');
    }

    // B3: CHECK TRÙNG (Xem ghế đã bị ai đặt chưa tại suất chiếu này)
    const existingTickets = await this.ticketRepository.find({
      where: {
        showtimeId: showtimeId,
        seat: { id: In(seatIds) },
      },
      relations: ['seat'],
    });

    if (existingTickets.length > 0) {
      const bookedList = existingTickets
        .map((t) => `${t.seat.row}${t.seat.number}`)
        .join(', ');
      throw new BadRequestException(
        `Ghế [${bookedList}] đã có người đặt! Vui lòng chọn ghế khác.`,
      );
    }

    // B4: TÍNH TỔNG TIỀN
    // Quy định: Ghế VIP phụ thu 100.000 VNĐ
    const VIP_SURCHARGE = 100000;
    let totalAmount = 0;

    // Lấy giá gốc từ Suất chiếu (ưu tiên) hoặc Phim
    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
    });
    if (!movie) throw new NotFoundException('Movie not found');
    const basePrice =
      showtime.price !== undefined
        ? Number(showtime.price)
        : Number(movie?.ticketPrice ?? 0);

    selectedSeats.forEach((seat) => {
      let currentSeatPrice = basePrice;

      if (seat.type === 'VIP') {
        currentSeatPrice += VIP_SURCHARGE; // Cộng thêm 100k nếu là VIP
      }

      totalAmount += currentSeatPrice;
    });

    // B5: TẠO BOOKING (Lưu vào DB)
    const booking = this.bookingRepository.create({
      userId: userId ? String(userId) : undefined,
      bookingDate: new Date(), // Thời điểm bấm nút đặt
      status: 'Paid',
      totalAmount,
      movie: movie!, // Link booking với phim
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // B6: TẠO VÉ CHI TIẾT (Tickets)
    const tickets = selectedSeats.map((seat) =>
      this.ticketRepository.create({
        showtimeId,
        seat: seat,
        booking: savedBooking,
      }),
    );

    await this.ticketRepository.save(tickets);

    // B7: TRẢ VỀ KẾT QUẢ CHI TIẾT (Bill)
    return {
      message: 'Đặt vé thành công!',
      bookingId: savedBooking.id,

      // Thông tin chi tiết cho Frontend hiển thị
      movieTitle: movie?.title ?? 'Unknown movie',
      cinemaRoom: showtime.room || 'Chưa cập nhật phòng',
      showTime: showtime.startTime, // Giờ chiếu phim
      bookingTime: savedBooking.bookingDate, // Giờ khách đặt vé

      seats: selectedSeats.map((s) => `${s.row}${s.number} (${s.type})`),
      totalAmount,
    };
  }

  async listSeatsByRoom(roomId: number) {
    return this.seatRepository.find({
      where: { roomId },
      order: { row: 'ASC', number: 'ASC' },
    });
  }

  async createSeat(data: {
    row: string;
    number: number;
    type?: string;
    roomId?: number;
  }) {
    const seat = this.seatRepository.create({
      row: data.row,
      number: data.number,
      type: data.type || 'Standard',
      roomId: data.roomId,
    });
    return this.seatRepository.save(seat);
  }

  async seedSeats(roomId: number, rows: string[]) {
    const seeds: Seat[] = [];
    rows.forEach((item) => {
      const [row, countStr] = item.split(':');
      const count = Number(countStr);
      if (!row || !count) return;
      for (let i = 1; i <= count; i++) {
        seeds.push(
          this.seatRepository.create({
            row: row.trim(),
            number: i,
            type: 'Standard',
            roomId,
          }),
        );
      }
    });
    if (seeds.length === 0) return [];
    return this.seatRepository.save(seeds);
  }

  async deleteSeatsByRoom(roomId: number) {
    const result = await this.seatRepository.delete({ roomId });
    return { deleted: result.affected ?? 0 };
  }
}
