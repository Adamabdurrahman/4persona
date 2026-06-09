import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
  IsEnum,
} from 'class-validator';

enum ElementType {
  API = 'API',
  AIR = 'AIR',
  ANGIN = 'ANGIN',
  TANAH = 'TANAH',
}

export class AnswerItemDto {
  @IsString()
  questionId: string;

  @IsString()
  optionId: string;

  @IsEnum(ElementType)
  targetType: ElementType;
}

export class SubmitTestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(24, { message: 'Harus ada 24 jawaban kepribadian' })
  @Type(() => AnswerItemDto)
  answers: AnswerItemDto[];

  @IsString()
  @IsOptional()
  surveySource?: string;

  @IsString()
  @IsOptional()
  surveyRelate?: string;
}
