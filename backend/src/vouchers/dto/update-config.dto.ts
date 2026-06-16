import { IsOptional, IsBoolean, IsString, IsInt, Min } from 'class-validator';

export class UpdateVoucherConfigDto {
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsString()
  voucherCode?: string;

  @IsOptional()
  @IsString()
  discountLabel?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalStock?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  expiryHours?: number;

  @IsOptional()
  @IsString()
  shopeeUrl?: string;
}

