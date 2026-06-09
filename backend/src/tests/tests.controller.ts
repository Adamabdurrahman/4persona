import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('tests')
export class TestsController {
  constructor(private testsService: TestsService) {}

  /**
   * POST /api/tests/submit
   * Submit jawaban tes — harus login
   */
  @Post('submit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  submitTest(@CurrentUser() user: any, @Body() dto: SubmitTestDto) {
    return this.testsService.submitTest(user.id, dto);
  }

  /**
   * GET /api/tests/report/:token
   * Ambil laporan via token — public (link di email)
   */
  @Get('report/:token')
  getReport(@Param('token') token: string) {
    return this.testsService.getReport(token);
  }

  /**
   * GET /api/tests/history
   * Riwayat tes user — harus login
   */
  @Get('history')
  @UseGuards(JwtAuthGuard)
  getHistory(@CurrentUser() user: any) {
    return this.testsService.getHistory(user.id);
  }

  /**
   * POST /api/tests/:id/feedback
   * Submit feedback/rating — harus login
   */
  @Post(':id/feedback')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  submitFeedback(
    @CurrentUser() user: any,
    @Param('id') testId: string,
    @Body('rating') rating: number,
    @Body('text') text?: string,
  ) {
    return this.testsService.submitFeedback(testId, user.id, rating, text);
  }
}
