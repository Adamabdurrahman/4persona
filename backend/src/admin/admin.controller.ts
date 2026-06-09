import {
  Controller,
  Get,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard) // Semua route admin butuh JWT + isAdmin
export class AdminController {
  constructor(private adminService: AdminService) {}

  /** GET /api/admin/stats */
  @Get('stats')
  getStats() {
    return this.adminService.getDashboardStats();
  }

  /** PATCH /api/admin/sales — Update manual sales count */
  @Patch('sales')
  updateSales(@Body('count') count: number) {
    return this.adminService.updateSalesCount(count);
  }

  /** GET /api/admin/templates */
  @Get('templates')
  getTemplates() {
    return this.adminService.getTemplates();
  }

  /** PUT /api/admin/templates/:id */
  @Put('templates/:id')
  updateTemplate(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateTemplate(id, body);
  }

  /** GET /api/admin/results?page=1 */
  @Get('results')
  getAllResults(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllResults(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }
}
