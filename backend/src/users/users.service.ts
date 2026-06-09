import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  async create(data: {
    email: string;
    name: string;
    password?: string;
    googleId?: string;
  }) {
    return this.prisma.user.create({ data });
  }

  async updateGoogleId(userId: string, googleId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { googleId },
    });
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        googleId: true,
      },
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }
}
