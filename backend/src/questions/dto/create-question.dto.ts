import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

enum ElementType {
  API = 'API',
  AIR = 'AIR',
  ANGIN = 'ANGIN',
  TANAH = 'TANAH',
}

export class CreateAnswerOptionDto {
  @IsString()
  text: string;

  @IsEnum(ElementType)
  targetType: ElementType;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class CreateQuestionDto {
  @IsString()
  text: string;

  @IsEnum(ElementType)
  element: ElementType;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  @Type(() => CreateAnswerOptionDto)
  options: CreateAnswerOptionDto[];
}
