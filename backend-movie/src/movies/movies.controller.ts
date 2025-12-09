import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'node:fs';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public } from 'src/decorator/customize';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @Public()
  findAll(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    return this.moviesService.findAll(
      status,
      limit ? +limit : undefined,
      page ? +page : undefined,
    );
  }

  @Get(':slugOrId')
  @Public()
  findOne(@Param('slugOrId') slugOrId: string) {
    return this.moviesService.findOne(slugOrId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }

  @Post('upload-poster')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'posters');
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadPoster(@UploadedFile() file: any) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
    return { imageUrl: `${baseUrl}/uploads/posters/${file.filename}` };
  }

  @Get('posters')
  @Public()
  getPosters() {
    const postersDir = join(process.cwd(), 'uploads', 'posters');
    if (!fs.existsSync(postersDir)) {
      return { files: [] };
    }
    const files = fs
      .readdirSync(postersDir)
      .filter((file) => !file.startsWith('.'))
      .map((file) => `/uploads/posters/${file}`);
    return { files };
  }
}
