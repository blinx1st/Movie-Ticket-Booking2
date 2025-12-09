import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, SelectQueryBuilder } from 'typeorm';
import { Booking } from 'src/revenue/entities/booking.entity';
import { Ticket } from 'src/seats/entities/ticket.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { CreateBookingDto, UpdateBookingDto } from './dto/create-booking.dto';
import { Cinema } from 'src/cinemas/entities/cinema.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Seat) private readonly seatRepo: Repository<Seat>,
    @InjectRepository(Showtime)
    private readonly showtimeRepo: Repository<Showtime>,
    @InjectRepository(Movie) private readonly movieRepo: Repository<Movie>,
  ) {}

  private baseQuery(): SelectQueryBuilder<Booking> {
    return this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.tickets', 'ticket')
      .leftJoinAndSelect('ticket.seat', 'seat')
      .leftJoinAndSelect('booking.movie', 'movie')
      .leftJoinAndMapOne(
        'booking.showtime',
        Showtime,
        'showtime',
        'showtime.id = booking.showtimeId',
      )
      .leftJoinAndMapOne(
        'booking.cinema',
        Cinema,
        'cinema',
        'cinema.id = booking.cinemaId',
      );
  }

  async checkout(dto: CreateBookingDto) {
    const showtime = await this.showtimeRepo.findOne({
      where: { id: dto.showtimeId },
    });
    if (!showtime) throw new NotFoundException('Showtime not found');
    if (showtime.movieId !== dto.movieId) {
      throw new BadRequestException('Showtime does not match movie');
    }

    const seats = await this.seatRepo.find({ where: { id: In(dto.seatIds) } });
    if (seats.length !== dto.seatIds.length) {
      throw new BadRequestException('Some seats not found');
    }
    if (showtime.roomId) {
      const invalid = seats.find(
        (s) => s.roomId && s.roomId !== showtime.roomId,
      );
      if (invalid) throw new BadRequestException('Seat not in this room');
    }

    // Check already booked seats in this showtime
    const existingTickets = await this.ticketRepo.find({
      where: { showtimeId: showtime.id, seat: { id: In(dto.seatIds) } },
      relations: ['seat'],
    });
    if (existingTickets.length > 0) {
      const bookedList = existingTickets
        .map((t) => `${t.seat.row}${t.seat.number}`)
        .join(', ');
      throw new BadRequestException(`Seats already booked: ${bookedList}`);
    }

    const movie = await this.movieRepo.findOne({ where: { id: dto.movieId } });
    if (!movie) throw new NotFoundException('Movie not found');

    const VIP_SURCHARGE = 100000;
    let totalAmount = 0;
    const basePrice =
      showtime.price !== undefined
        ? Number(showtime.price)
        : Number(movie.ticketPrice ?? 0);
    const ticketsToCreate: Ticket[] = [];
    seats.forEach((seat) => {
      let price = basePrice;
      if (seat.type === 'VIP') price += VIP_SURCHARGE;
      totalAmount += price;
      ticketsToCreate.push(
        this.ticketRepo.create({
          showtimeId: showtime.id,
          seat,
          price,
        }),
      );
    });

    const booking = this.bookingRepo.create({
      userId: dto.userId,
      movieId: movie.id,
      showtimeId: showtime.id,
      cinemaId: showtime.cinemaId,
      totalAmount,
      status: 'Paid',
      paymentMethod: dto.paymentMethod || 'Mock',
      paymentRef: dto.paymentRef,
      source: 'booking',
      tickets: ticketsToCreate,
    });

    const saved = await this.bookingRepo.save(booking);
    return this.baseQuery()
      .where('booking.id = :id', { id: saved.id })
      .getOne();
  }

  findAll(status?: string) {
    const qb = this.baseQuery();
    if (status) qb.andWhere('booking.status = :status', { status });
    return qb.orderBy('booking.bookingDate', 'DESC').getMany();
  }

  async findMine(userId: string) {
    return this.baseQuery()
      .where('booking.userId = :userId', { userId })
      .orderBy('booking.bookingDate', 'DESC')
      .getMany();
  }

  async findOne(id: number) {
    const booking = await this.baseQuery()
      .where('booking.id = :id', { id })
      .getOne();
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async update(id: number, dto: UpdateBookingDto) {
    const booking = await this.findOne(id);
    this.bookingRepo.merge(booking, {
      ...dto,
      totalAmount:
        dto.totalAmount !== undefined
          ? Number(dto.totalAmount)
          : booking.totalAmount,
    });
    return this.bookingRepo.save(booking);
  }

  async remove(id: number) {
    const booking = await this.findOne(id);
    await this.bookingRepo.remove(booking);
    return { message: 'Deleted' };
  }
}
