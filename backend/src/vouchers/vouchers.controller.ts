import {
  Controller,
  Get,
  Put,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { UpdateVoucherConfigDto } from './dto/update-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller()
export class VouchersController {
  constructor(private vouchersService: VouchersService) {}

  // ─── Public: homepage promo info ──────────────────────────
  @Get('vouchers/public')
  getPublicConfig() {
    return this.vouchersService.getPublicConfig();
  }

  // ─── User: get my voucher ─────────────────────────────────
  @Get('vouchers/my')
  @UseGuards(JwtAuthGuard)
  getMyVoucher(@CurrentUser() user: any) {
    return this.vouchersService.getMyVoucher(user.id);
  }

  // ─── Admin: get full config ───────────────────────────────
  @Get('admin/vouchers/config')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getConfig() {
    return this.vouchersService.getConfig();
  }

  // ─── Admin: update config ─────────────────────────────────
  @Put('admin/vouchers/config')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateConfig(@Body() dto: UpdateVoucherConfigDto) {
    return this.vouchersService.updateConfig(dto);
  }

  // ─── Admin: list claims ───────────────────────────────────
  @Get('admin/vouchers/claims')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getClaims(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.vouchersService.getClaims(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }
}
