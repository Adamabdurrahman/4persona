import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  /**
   * GET /api/metrics/public
   * Public endpoint — return stats for homepage
   */
  @Get('public')
  getPublicMetrics() {
    return this.metricsService.getPublicMetrics();
  }

  /**
   * POST /api/metrics/ping
   * Dipanggil saat user buka homepage — increment visitor counter
   * Tidak perlu JWT, 204 No Content
   */
  @Post('ping')
  @HttpCode(HttpStatus.NO_CONTENT)
  async ping() {
    await this.metricsService.incrementVisitor();
  }
}
