import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  ManualTransactionDto,
  UpdateTransactionDto,
} from './dto/manual-transaction.dto';

@ApiTags('Revenue Management')
@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Xem tổng doanh thu và số giao dịch' })
  async getSummary(@Query('from') from?: string, @Query('to') to?: string) {
    return this.revenueService.getSummary(from, to);
  }

  @Get('users-count')
  @ApiOperation({ summary: 'Đếm số lượng User đã từng đặt vé' })
  async getUsersCount() {
    return this.revenueService.getUniqueUserCount();
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Danh sách booking/transaction (admin)' })
  async getTransactions(
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('userId') userId?: string,
  ) {
    return this.revenueService.listTransactions(status, from, to, userId);
  }

  @Post('transactions')
  @ApiOperation({ summary: 'Tạo transaction/booking thủ công (admin)' })
  async createTx(@Body() dto: ManualTransactionDto) {
    return this.revenueService.createTransaction(dto);
  }

  @Patch('transactions/:id')
  @ApiOperation({ summary: 'Cập nhật transaction/booking (admin)' })
  async updateTx(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.revenueService.updateTransaction(+id, dto);
  }

  @Delete('transactions/:id')
  @ApiOperation({ summary: 'Xóa transaction/booking (admin)' })
  async deleteTx(@Param('id') id: string) {
    return this.revenueService.removeTransaction(+id);
  }
}
