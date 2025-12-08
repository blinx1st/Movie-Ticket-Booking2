import { Controller, Get } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Revenue Management')
@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get('total')
  @ApiOperation({ summary: 'Xem tổng doanh thu toàn hệ thống' })
  async getTotal() {
    return this.revenueService.getTotalRevenue();
  }

  @Get('users-count')
  @ApiOperation({ summary: 'Đếm số lượng User đã từng đặt vé' })
  async getUsersCount() {
    return this.revenueService.getUniqueUserCount();
  }
}