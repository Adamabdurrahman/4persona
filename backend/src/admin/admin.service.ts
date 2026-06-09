import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }

  async getDashboardStats() {
    const [
      totalUsers,
      totalTests,
      totalQuestions,
      systemMetric,
      elementBreakdown,
      recentTests,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.testResult.count(),
      this.prisma.question.count({ where: { isActive: true } }),
      this.prisma.systemMetric.findUnique({ where: { id: 1 } }),
      this.prisma.testResult.groupBy({
        by: ['personaPrimer'],
        _count: { personaPrimer: true },
        orderBy: { _count: { personaPrimer: 'desc' } },
      }),
      this.prisma.testResult.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          personaPrimer: true,
          personaSekunder: true,
          scoreApi: true,
          scoreAir: true,
          scoreAngin: true,
          scoreTanah: true,
          surveySource: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    return {
      totalUsers,
      totalTests,
      totalQuestions,
      totalSales: systemMetric?.manualSalesCount ?? 0,
      totalVisitors: systemMetric?.totalVisitors ?? 0,
      elementBreakdown: elementBreakdown.map((g) => ({
        element: g.personaPrimer,
        count: g._count.personaPrimer,
        percentage: totalTests > 0 ? Math.round((g._count.personaPrimer / totalTests) * 100) : 0,
      })),
      recentTests,
    };
  }

  async updateSalesCount(count: number) {
    return this.prisma.systemMetric.update({
      where: { id: 1 },
      data: { manualSalesCount: count },
    });
  }

  // ── Report Template CRUD ──────────────────────────────────
  async getTemplates() {
    return this.prisma.reportTemplate.findMany();
  }

  async updateTemplate(
    id: string,
    data: {
      parfumName?: string;
      description?: string;
      descriptionPlus?: string;
      descriptionMinus?: string;
      parfumRecommendation?: string;
      parfumTagline?: string;
      shopeeLink?: string;
      tiktokLink?: string;
      instagramLink?: string;
    },
  ) {
    // id adalah ElementType enum di Prisma, cast agar TS tidak error
    return this.prisma.reportTemplate.update({ where: { id: id as any }, data });
  }

  // ── All test results for admin ────────────────────────────
  async getAllResults(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      this.prisma.testResult.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          personaPrimer: true,
          personaSekunder: true,
          scoreApi: true,
          scoreAir: true,
          scoreAngin: true,
          scoreTanah: true,
          surveySource: true,
          feedbackRating: true,
          reportToken: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
        },
      }),
      this.prisma.testResult.count(),
    ]);

    return { results, total, page, totalPages: Math.ceil(total / limit) };
  }
}
