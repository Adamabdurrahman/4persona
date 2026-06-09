import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MetricsModule } from './metrics/metrics.module';
import { QuestionsModule } from './questions/questions.module';
import { TestsModule } from './tests/tests.module';
import { EmailModule } from './email/email.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MetricsModule,
    QuestionsModule,
    TestsModule,
    EmailModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
