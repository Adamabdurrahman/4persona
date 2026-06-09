import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  /**
   * GET /api/questions/session
   * Ambil 25 soal untuk sesi tes — harus login
   */
  @Get('session')
  @UseGuards(JwtAuthGuard)
  getSessionQuestions() {
    return this.questionsService.getSessionQuestions();
  }

  /**
   * GET /api/questions?element=API
   * List semua soal — admin only
   */
  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll(@Query('element') element?: string) {
    return this.questionsService.findAll(element);
  }

  /**
   * GET /api/questions/:id — admin only
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  /**
   * POST /api/questions — admin only
   */
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateQuestionDto) {
    return this.questionsService.create(dto);
  }

  /**
   * PUT /api/questions/:id — admin only
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionsService.update(id, dto);
  }

  /**
   * DELETE /api/questions/:id — admin only
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }

  /**
   * PATCH /api/questions/:id/toggle — Toggle isActive — admin only
   */
  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, AdminGuard)
  toggleActive(@Param('id') id: string) {
    return this.questionsService.toggleActive(id);
  }
}
