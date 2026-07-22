import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AIController } from './ai-generator.controller';
import { AIService } from './ai-generator.service';
import { AIExceptionFilter } from './filters/ai-exception.filter';
import { CardsRepoModule } from '../cards-repo/cards-repo.module';

@Module({
  imports: [CardsRepoModule],
  controllers: [AIController],
  providers: [
    AIService,
    {
      provide: APP_FILTER,
      useClass: AIExceptionFilter,
    },
  ],
})
export class AIModule {}
