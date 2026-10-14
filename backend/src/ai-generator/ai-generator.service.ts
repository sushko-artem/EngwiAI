import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GenerateSentencesDto } from './DTO/generate-sentences.dto';
import { CardsRepoService } from '../cards-repo/cards-repo.service';
import { AIGenerationResult } from './types/ai.types';
import { AIChatOptions, AIMessage } from './types/ai.model.types';
import { AIGenerationException } from './exceptions/ai-generation.exception';
import { mockSentences } from './mock';
import { AIConfigService } from './ai-config.service';
import { isValidTerm } from './utils';
import { AIClient } from './ai.client';
import { PromptsBuilder } from './prompts/prompts.builder';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(
    private readonly aiConfig: AIConfigService,
    private readonly cardsRepoService: CardsRepoService,
    private readonly aiClient: AIClient,
    private readonly promts: PromptsBuilder,
  ) {}

  async generateSentences(userId: string, dto: GenerateSentencesDto): Promise<AIGenerationResult> {
    const { id, difficulty, cardSide, count } = dto;

    if (!this.aiConfig.enabled) {
      return this.buildMockResult(count);
    }

    this.logger.log(`Generating ${count} sentences`);

    const collection = await this.cardsRepoService.getCollection(userId, id);
    const validCards = collection.cards.filter((card) => {
      const term = card[cardSide];
      return isValidTerm(term);
    });

    if (validCards.length === 0) {
      throw new AIGenerationException(
        'В коллекции нет подходящих слов для генерации предложений.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const terms = validCards.map((card) => card[cardSide]).join(', ');
    const translateTo = validCards.map((card) => (cardSide === 'word' ? card.translation : card.word)).join(', ');

    const systemPrompt = this.promts.buildSystemPrompt(difficulty);
    const userPrompt = this.promts.buildUserPrompt(terms, count, translateTo, difficulty);

    const complexityTokens = {
      beginner: 1000,
      intermediate: 2000,
      advanced: 4000,
    };

    const prompt: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const promptOptions: AIChatOptions = {
      maxTokens: complexityTokens[difficulty] ?? this.aiConfig.maxTokens,
    };

    try {
      const data = await this.aiClient.chat(prompt, promptOptions);
      const content = data.choices[0].message.content;

      this.logger.log(`Generated successfully, tokens used: ${data.usage.total_tokens}`);

      const result = JSON.parse(content) as AIGenerationResult;

      if (!result.sentences || !Array.isArray(result.sentences)) {
        throw new AIGenerationException(
          'Некорректная структура ответа от ИИ. Пожалуйста, попробуйте позже.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result;
    } catch (error) {
      if (error instanceof AIGenerationException) {
        throw error;
      }
      this.logger.error(`Unexpected error: ${error}`);
      throw new AIGenerationException(
        'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private buildMockResult(count: number): AIGenerationResult {
    return {
      sentences: Array.from({ length: count }, (_, i) => mockSentences[i % mockSentences.length]),
    };
  }
}
