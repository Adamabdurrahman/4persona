import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CacheEntry {
  data: any;
  expiresAt: number;
}

@Injectable()
export class MetricsService {
  private cache: CacheEntry | null = null;
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 menit

  constructor(private prisma: PrismaService) {}

  async getPublicMetrics() {
    // Return dari cache jika masih valid
    if (this.cache && Date.now() < this.cache.expiresAt) {
      return this.cache.data;
    }

    // Fetch semua data secara paralel
    const [systemMetric, totalTests, elementGroups] = await Promise.all([
      this.prisma.systemMetric.findUnique({ where: { id: 1 } }),
      this.prisma.testResult.count(),
      this.prisma.testResult.groupBy({
        by: ['personaPrimer'],
        _count: { personaPrimer: true },
        orderBy: { _count: { personaPrimer: 'desc' } },
      }),
    ]);

    // Tentukan elemen dominan
    const dominantElement = elementGroups.length > 0
      ? elementGroups[0].personaPrimer
      : null;

    const data = {
      totalVisitors: systemMetric?.totalVisitors ?? 0,
      totalTests,
      totalSales: systemMetric?.manualSalesCount ?? 0,
      dominantElement,
      elementBreakdown: elementGroups.map((g) => ({
        element: g.personaPrimer,
        count: g._count.personaPrimer,
      })),
    };

    // Simpan ke cache
    this.cache = { data, expiresAt: Date.now() + this.CACHE_TTL_MS };

    return data;
  }

  async incrementVisitor() {
    await this.prisma.systemMetric.update({
      where: { id: 1 },
      data: { totalVisitors: { increment: 1 } },
    });
    // Invalidate cache setelah increment
    this.cache = null;
  }
}
