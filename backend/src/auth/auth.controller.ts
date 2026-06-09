import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  // ─── POST /api/auth/register ──────────────────────────────
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ─── POST /api/auth/login ─────────────────────────────────
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ─── GET /api/auth/me ─────────────────────────────────────
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }

  // ─── GET /api/auth/google ─────────────────────────────────
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Passport akan redirect ke Google secara otomatis
  }

  // ─── GET /api/auth/google/callback ───────────────────────
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    const { token, user } = await this.authService.googleLogin(req.user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    // Redirect ke frontend dengan token sebagai query param
    // Frontend akan menyimpan token ke localStorage
    res.redirect(
      `${frontendUrl}/auth/callback?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`,
    );
  }
}
