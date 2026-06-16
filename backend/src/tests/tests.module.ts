import { Module } from '@nestjs/common';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { EmailModule } from '../email/email.module';
import { VouchersModule } from '../vouchers/vouchers.module';

@Module({
  imports: [EmailModule, VouchersModule],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}

