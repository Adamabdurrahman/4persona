import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

// Soal penutup (ke-21) — hardcoded, bisa dipindah ke DB nanti
const CLOSING_QUESTION = {
  id: 'closing-q21',
  text: 'Dari mana kamu mengenal Vun Diego?',
  element: null,
  isClosingQuestion: true,
  options: [
    { id: 'cq-1', text: 'Instagram / TikTok', targetType: null, order: 0 },
    { id: 'cq-2', text: 'Rekomendasi teman atau keluarga', targetType: null, order: 1 },
    { id: 'cq-3', text: 'Marketplace (Shopee/Tokopedia)', targetType: null, order: 2 },
    { id: 'cq-4', text: 'Google / Search Engine', targetType: null, order: 3 },
    { id: 'cq-5', text: 'Event / Pop-up store', targetType: null, order: 4 },
    { id: 'cq-6', text: 'Lainnya', targetType: null, order: 5 },
  ],
};

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  // ─── Fisher-Yates Shuffle ────────────────────────────────
  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ─── GET Session Questions (5-5-5-5 + 1 penutup) ────────
  async getSessionQuestions() {
    const elements = ['API', 'AIR', 'ANGIN', 'TANAH'] as const;

    // Tarik 5 soal random per elemen secara paralel
    const questionsByElement = await Promise.all(
      elements.map(async (el) => {
        const all = await this.prisma.question.findMany({
          where: { element: el, isActive: true },
          include: { options: { orderBy: { order: 'asc' } } },
        });

        if (all.length < 5) {
          throw new BadRequestException(
            `Soal untuk elemen ${el} kurang dari 5. Harap tambah soal terlebih dahulu.`,
          );
        }

        // Ambil 5 soal secara acak
        return this.shuffle(all).slice(0, 5);
      }),
    );

    // Gabungkan semua 20 soal kepribadian lalu shuffle
    const personalityQuestions = this.shuffle(questionsByElement.flat()).map(
      (q, index) => ({ ...q, questionNumber: index + 1, isClosingQuestion: false }),
    );

    // Tambahkan soal penutup di posisi terakhir (ke-21)
    return [
      ...personalityQuestions,
      { ...CLOSING_QUESTION, questionNumber: 21 },
    ];
  }

  // ─── Admin CRUD ──────────────────────────────────────────
  async findAll(element?: string) {
    return this.prisma.question.findMany({
      where: element ? { element: element as any } : undefined,
      include: { options: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { options: { orderBy: { order: 'asc' } } },
    });
    if (!question) throw new NotFoundException('Soal tidak ditemukan');
    return question;
  }

  async create(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        text: dto.text,
        element: dto.element as any,
        options: {
          create: dto.options.map((opt, i) => ({
            text: opt.text,
            targetType: opt.targetType as any,
            order: opt.order ?? i,
          })),
        },
      },
      include: { options: true },
    });
  }

  async update(id: string, dto: UpdateQuestionDto) {
    await this.findOne(id); // validate exists

    const updateData: any = {};
    if (dto.text !== undefined) updateData.text = dto.text;
    if (dto.element !== undefined) updateData.element = dto.element;
    if (dto.options !== undefined) {
      updateData.options = {
        deleteMany: {},
        create: dto.options.map((opt, i) => ({
          text: opt.text,
          targetType: opt.targetType as any,
          order: opt.order ?? i,
        })),
      };
    }

    return this.prisma.question.update({
      where: { id },
      data: updateData,
      include: { options: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.question.delete({ where: { id } });
  }

  async toggleActive(id: string) {
    const question = await this.findOne(id);
    return this.prisma.question.update({
      where: { id },
      data: { isActive: !question.isActive },
    });
  }
}
