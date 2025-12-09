// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

// Controller + Service gốc bên Mongo
import { AppController } from './app.controller';
import { AppService } from './app.service';

// ====== AUTH (Mongo) ======
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/dto/passport/jwt-auth.guard';
import { UsersModule } from './users/users.module'; // Users dùng Mongo

// ====== CORE (Interceptor) ======
import { TransformInterceptor } from './core/transform.interceptor';

// ====== CÁC MODULE DÙNG MYSQL (XAMPP) ======
import { MoviesModule } from './movies/movies.module';
import { SeatsModule } from './seats/seats.module';
import { RevenueModule } from './revenue/revenue.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { CinemaRoomsModule } from './screens/cinema-room.module';
import { CinemasModule } from './cinemas/cinemas.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    // 1. Config global cho cả Mongo + MySQL + Mail
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),

    // 2. Kết nối MySQL (XAMPP) cho các module Movies/Seats/Showtimes/CinemaRooms/Revenue
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'movie_ticket_db',
      autoLoadEntities: true,
      synchronize: true, // CHỈ dùng lúc dev
    }),

    // 3. Kết nối MongoDB (Auth, Users, mail verify, v.v.)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // 4. Mailer (bên Mongo app)
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        template: {
          dir: process.cwd() + '/src/email/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

    // ====== MODULE MONGO (AUTH + USERS) ======
    UsersModule,
    AuthModule,

    // ====== MODULE MYSQL (CINEMA SYSTEM) ======
    MoviesModule,
    SeatsModule,
    RevenueModule,
    ShowtimesModule,
    CinemaRoomsModule,
    CinemasModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // JwtAuthGuard dùng global cho toàn bộ API
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Interceptor format response
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
