import { Module } from '@nestjs/common';
import { GroqModule } from '../groq/groq.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CvsController } from './cvs.controller';
import { CvsService } from './cvs.service';

@Module({
  imports: [PrismaModule, GroqModule],
  controllers: [CvsController],
  providers: [CvsService],
})
export class CvsModule {}
