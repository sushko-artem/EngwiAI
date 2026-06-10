import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateSentencesDto } from './DTO/generate-sentences.dto';
import { CardsRepoService } from '../cards-repo/cards-repo.service';
import { AIGenerationResult } from './types/ai.types';
import { GroqResponse } from './types/groq.types';
import { AIGenerationException } from './exceptions/ai-generation.exception';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly apiKey: string;
  private readonly model: string;
  private readonly maxTokens: number;
  private readonly apiUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly cardsRepoService: CardsRepoService,
  ) {
    this.apiKey = this.configService.getOrThrow<string>('AI_API_KEY');
    this.model = this.configService.getOrThrow<string>('AI_MODEL');
    this.maxTokens = this.configService.getOrThrow<number>('AI_MAX_TOKENS');
    this.apiUrl = this.configService.getOrThrow<string>('AI_API_URL');

    if (!this.apiKey) {
      throw new Error('AI_API_KEY is not defined');
    }
  }

  async generateSentences(userId: string, dto: GenerateSentencesDto): Promise<AIGenerationResult> {
    const { id, difficulty, cardSide, count } = dto;

    this.logger.log(`Generating ${count} sentences`);

    const collection = await this.cardsRepoService.getCollection(userId, id);
    const validCards = collection.cards.filter((card) => {
      const term = card[cardSide];
      return this.isValidTerms(term);
    });

    if (validCards.length === 0) {
      throw new AIGenerationException('No valid terms', HttpStatus.BAD_REQUEST);
    }

    const termsForSentencesGeneration = validCards.map((card) => card[cardSide]).join(', ');
    const translateTo = validCards.map((card) => (cardSide === 'word' ? card.translation : card.word)).join(', ');

    const systemPrompt = this.buildSystemPrompt(difficulty);
    const userPrompt = this.buildUserPrompt(termsForSentencesGeneration, count, translateTo);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: this.maxTokens,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(`AI API error: ${response.status} - ${errorBody}`);
        throw new AIGenerationException(
          `Failed to generate sentences: ${response.status}`,
          response.status === 429 ? HttpStatus.TOO_MANY_REQUESTS : HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const data = (await response.json()) as GroqResponse;
      const content = data.choices[0].message.content;

      this.logger.log(`Generated successfully, tokens used: ${data.usage.total_tokens}`);

      const result = JSON.parse(content) as AIGenerationResult;

      if (!result.sentences || !Array.isArray(result.sentences)) {
        throw new AIGenerationException('Invalid response structure from AI', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return result;
    } catch (error) {
      if (error instanceof AIGenerationException) {
        throw error;
      }
      this.logger.error(`Unexpected error: ${error}`);
      throw new AIGenerationException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private isValidTerms(term: string): boolean {
    if (!term || term.length < 2) return false;

    const hasLetter = /\p{L}/u.test(term);
    if (!hasLetter) return false;

    const letters = term.match(/\p{L}/gu) || [];
    const ratio = letters.length / term.length;
    if (ratio < 0.4) return false;

    return true;
  }

  private buildSystemPrompt(difficulty: string): string {
    const difficultyMap = {
      beginner: 'начальный',
      intermediate: 'средний',
      advanced: 'продвинутый',
    };
    return `Ты - ассистент по изучению языков.
Твоя задача - создавать предложения, которые помогают запоминать термины через контекст.
Правила:
- Уровень сложности: ${difficultyMap[difficulty]}
- Каждое предложение должно быть естественным и ясно показывать использование термина.
- Предложения должны быть полезны для метода интервальных повторений.
- Отвечай ТОЛЬКО валидным JSON, без markdown и лишнего текста.
- Не добавляй комментарии, объяснения или форматирование.
Формат ответа:
{
  "sentences": [
      {
      "term": "исходный термин",
      "sentence": "Естественное предложение с использованием термина",
      "translation": "Перевод предложения"
      }
  ]
}
`;
  }

  private buildUserPrompt(terms: string, count: number, translateTo: string) {
    return `Создай ровно ${count} предложений, используя эти термины: ${terms}

Требования:
- В одном предложении можно использовать несколько терминов, сохраняя естественный контекст
- Если терминов меньше чем ${count}, добавь предложения с похожей лексикой
- Постарайся охватить все предоставленные термины в этих ${count} предложениях
- Предложения должны быть разнообразными и естественными
- Перевод каждого предложения должен быть на языке, на котором написаны эти термины: ${translateTo}
- Убедись, что перевод точный и соответствует контексту`;
  }
}
