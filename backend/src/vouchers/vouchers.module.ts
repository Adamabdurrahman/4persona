import { Module } from '@nestjs/common';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';

@Module({
  controllers: [VouchersController],
  providers: [VouchersService],
  exports: [VouchersService], // exported so TestsModule can inject it
})
export class VouchersModule {}
