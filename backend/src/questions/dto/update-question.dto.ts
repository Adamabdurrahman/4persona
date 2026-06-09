import { IsString, IsEnum, IsArray, ValidateNested, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

enum ElementType { API = 'API', AIR = 'AIR', ANGIN = 'ANGIN', TANAH = 'TANAH' }

class UpdateAnswerOptionDto {
  @IsOptional() @IsString() text?: string;
  @IsOptional() @IsEnum(ElementType) targetType?: ElementType;
  @IsOptional() @IsInt() @Min(0) order?: number;
}

export class UpdateQuestionDto {
  @IsOptional() @IsString() text?: string;
  @IsOptional() @IsEnum(ElementType) element?: ElementType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAnswerOptionDto)
  options?: UpdateAnswerOptionDto[];
}

