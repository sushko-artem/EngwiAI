import { Module } from '@nestjs/common';
import { AIController } from './ai-generator.controller';
import { AIService } from './ai-generator.service';
import { CardsRepoModule } from '../cards-repo/cards-repo.module';
import { AIConfigService } from './ai-config.service';
import { AIClient } from './ai.client';
import { PromptsBuilder } from './prompts/prompts.builder';

@Module({
  imports: [CardsRepoModule],
  controllers: [AIController],
  providers: [AIConfigService, AIService, AIClient, PromptsBuilder],
  exports: [AIConfigService],
})
export class AIModule {}
