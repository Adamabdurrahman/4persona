import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ─── Helpers ──────────────────────────────────────────────
  private generateToken(userId: string, email: string): string {
    const secret = this.configService.get<string>('JWT_SECRET') as string;
    const expiresIn = (this.configService.get<string>('JWT_EXPIRY') || '7d') as any;
    return this.jwtService.sign(
      { sub: userId, email },
      { secret, expiresIn },
    );
  }

  private sanitizeUser(user: any) {
    const { password, googleId, ...rest } = user;
    return rest;
  }

  // ─── Register ─────────────────────────────────────────────
  async register(dto: RegisterDto) {
    // Cek email sudah digunakan
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Buat user baru
    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id, user.email);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  // ─── Login ────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  // ─── Google OAuth Callback ────────────────────────────────
  async googleLogin(googleUser: {
    googleId: string;
    email: string;
    name: string;
  }) {
    let user = await this.usersService.findByGoogleId(googleUser.googleId);

    if (!user) {
      // Cek apakah ada akun dengan email yang sama
      const existingByEmail = await this.usersService.findByEmail(
        googleUser.email,
      );

      if (existingByEmail) {
        // Merge akun: link googleId ke akun yang sudah ada
        user = await this.usersService.updateGoogleId(
          existingByEmail.id,
          googleUser.googleId,
        );
      } else {
        // Buat akun baru
        user = await this.usersService.create({
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.googleId,
        });
      }
    }

    const token = this.generateToken(user.id, user.email);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  // ─── Get Profile ──────────────────────────────────────────
  async getProfile(userId: string) {
    return this.usersService.getProfile(userId);
  }
}
