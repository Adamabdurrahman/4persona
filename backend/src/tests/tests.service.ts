import {
  Injectable,
  NotFoundException,
  GoneException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { randomUUID } from 'crypto';

type ElementType = 'API' | 'AIR' | 'ANGIN' | 'TANAH';

// Tie-breaker hierarchy: API > AIR > ANGIN > TANAH
const ELEMENT_HIERARCHY: ElementType[] = ['API', 'AIR', 'ANGIN', 'TANAH'];

@Injectable()
export class TestsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // ─── Submit Test ─────────────────────────────────────────
  async submitTest(
    userId: string,
    dto: SubmitTestDto,
  ) {
    const { answers, surveySource = 'Tidak disebutkan', surveyRelate } = dto;

    // 1. Hitung skor per elemen
    const scores: Record<ElementType, number> = {
      API: 0, AIR: 0, ANGIN: 0, TANAH: 0,
    };

    for (const answer of answers) {
      const el = answer.targetType as ElementType;
      if (scores[el] !== undefined) scores[el]++;
    }

    // 2. Tentukan persona primer & sekunder
    const sorted = (Object.entries(scores) as [ElementType, number][])
      .sort(([elA, scoreA], [elB, scoreB]) => {
        if (scoreB !== scoreA) return scoreB - scoreA;
        // Tie-breaker: gunakan hierarchy
        return ELEMENT_HIERARCHY.indexOf(elA) - ELEMENT_HIERARCHY.indexOf(elB);
      });

    const personaPrimer = sorted[0][0];
    const personaSekunder = sorted[1][0];

    // 3. Generate report token (UUID) & expiry (30 hari)
    const reportToken = randomUUID();
    const expiryDays = 30;
    const reportTokenExp = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    // 4. Simpan TestResult ke database
    const testResult = await this.prisma.testResult.create({
      data: {
        userId,
        scoreApi: scores.API,
        scoreAir: scores.AIR,
        scoreAngin: scores.ANGIN,
        scoreTanah: scores.TANAH,
        personaPrimer,
        personaSekunder,
        surveySource,
        surveyRelate,
        reportToken,
        reportTokenExp,
      },
    });

    // 5. Kirim email asinkron (tidak block response)
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      this.emailService
        .sendReportEmail(user.email, user.name, reportToken, personaPrimer)
        .catch((err) => console.error('Email error:', err));
    }

    // 6. Return hasil
    return {
      personaPrimer,
      personaSekunder,
      reportToken,
      scores: {
        API: scores.API,
        AIR: scores.AIR,
        ANGIN: scores.ANGIN,
        TANAH: scores.TANAH,
      },
    };
  }

  // ─── Get Report by Token ─────────────────────────────────
  async getReport(token: string) {
    const testResult = await this.prisma.testResult.findUnique({
      where: { reportToken: token },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!testResult) {
      throw new NotFoundException('Laporan tidak ditemukan');
    }

    // Cek apakah token expired
    if (new Date() > testResult.reportTokenExp) {
      throw new GoneException('Link laporan sudah kadaluarsa (30 hari)');
    }

    // Ambil template laporan untuk persona primer & sekunder
    const [templatePrimer, templateSekunder] = await Promise.all([
      this.prisma.reportTemplate.findUnique({ where: { id: testResult.personaPrimer } }),
      this.prisma.reportTemplate.findUnique({ where: { id: testResult.personaSekunder } }),
    ]);

    return {
      id: testResult.id,
      user: testResult.user,
      scores: {
        API: testResult.scoreApi,
        AIR: testResult.scoreAir,
        ANGIN: testResult.scoreAngin,
        TANAH: testResult.scoreTanah,
      },
      personaPrimer: testResult.personaPrimer,
      personaSekunder: testResult.personaSekunder,
      templatePrimer,
      templateSekunder,
      surveySource: testResult.surveySource,
      feedbackRating: testResult.feedbackRating,
      feedbackText: testResult.feedbackText,
      createdAt: testResult.createdAt,
      expiresAt: testResult.reportTokenExp,
    };
  }

  // ─── Get Test History (user) ─────────────────────────────
  async getHistory(userId: string) {
    return this.prisma.testResult.findMany({
      where: { userId },
      select: {
        id: true,
        personaPrimer: true,
        personaSekunder: true,
        scoreApi: true,
        scoreAir: true,
        scoreAngin: true,
        scoreTanah: true,
        reportToken: true,
        reportTokenExp: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Submit Feedback ─────────────────────────────────────
  async submitFeedback(
    testId: string,
    userId: string,
    rating: number,
    text?: string,
  ) {
    const testResult = await this.prisma.testResult.findFirst({
      where: { id: testId, userId },
    });

    if (!testResult) {
      throw new NotFoundException('Hasil tes tidak ditemukan');
    }

    return this.prisma.testResult.update({
      where: { id: testId },
      data: { feedbackRating: rating, feedbackText: text },
    });
  }
}
