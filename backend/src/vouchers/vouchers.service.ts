import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateVoucherConfigDto } from './dto/update-config.dto';

@Injectable()
export class VouchersService {
  constructor(private prisma: PrismaService) {}

  // ─── Ensure config row exists (singleton pattern) ─────────
  private async ensureConfig() {
    const existing = await this.prisma.voucherConfig.findUnique({ where: { id: 1 } });
    if (!existing) {
      return this.prisma.voucherConfig.create({ data: { id: 1 } });
    }
    return existing;
  }

  // ─── Public: info for homepage promo banner ───────────────
  async getPublicConfig() {
    const config = await this.ensureConfig();
    const remaining = Math.max(0, config.totalStock - config.claimedCount);

    return {
      isEnabled: config.isEnabled,
      discountLabel: config.discountLabel,
      totalStock: config.totalStock,
      remainingStock: remaining,
    };
  }

  // ─── Admin: full config ───────────────────────────────────
  async getConfig() {
    return this.ensureConfig();
  }

  // ─── Admin: update config ─────────────────────────────────
  async updateConfig(dto: UpdateVoucherConfigDto) {
    await this.ensureConfig();
    return this.prisma.voucherConfig.update({
      where: { id: 1 },
      data: dto,
    });
  }

  // ─── Claim voucher (called after test submit) ─────────────
  async claimVoucher(userId: string) {
    const config = await this.ensureConfig();

    // Check: fitur aktif?
    if (!config.isEnabled) {
      throw new BadRequestException('Sistem voucher sedang tidak aktif');
    }

    // Check: stok tersedia?
    const remaining = config.totalStock - config.claimedCount;
    if (remaining <= 0) {
      throw new BadRequestException('Stok voucher sudah habis');
    }

    // Check: user sudah pernah claim?
    const existing = await this.prisma.voucherClaim.findUnique({
      where: { userId },
    });
    if (existing) {
      throw new BadRequestException('Kamu sudah pernah mendapatkan voucher');
    }

    // Calculate expiry
    const expiresAt = new Date(Date.now() + config.expiryHours * 60 * 60 * 1000);

    // Create claim + increment claimedCount (transaction)
    const [claim] = await this.prisma.$transaction([
      this.prisma.voucherClaim.create({
        data: {
          userId,
          voucherCode: config.voucherCode,
          expiresAt,
        },
      }),
      this.prisma.voucherConfig.update({
        where: { id: 1 },
        data: { claimedCount: { increment: 1 } },
      }),
    ]);

    return claim;
  }

  // ─── User: get my voucher ─────────────────────────────────
  async getMyVoucher(userId: string) {
    const claim = await this.prisma.voucherClaim.findUnique({
      where: { userId },
    });

    if (!claim) {
      return null;
    }

    // Get config for shopeeUrl
    const config = await this.ensureConfig();

    const now = new Date();
    const isExpired = now > claim.expiresAt;

    return {
      id: claim.id,
      voucherCode: claim.voucherCode,
      claimedAt: claim.claimedAt,
      expiresAt: claim.expiresAt,
      isExpired,
      shopeeUrl: config.shopeeUrl,
      discountLabel: config.discountLabel,
    };
  }

  // ─── Admin: list all claims ───────────────────────────────
  async getClaims(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [claims, total] = await Promise.all([
      this.prisma.voucherClaim.findMany({
        skip,
        take: limit,
        orderBy: { claimedAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      this.prisma.voucherClaim.count(),
    ]);

    const now = new Date();
    return {
      claims: claims.map((c) => ({
        ...c,
        isExpired: now > c.expiresAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
