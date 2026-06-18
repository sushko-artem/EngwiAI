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
    this.maxTokens = Number(this.configService.getOrThrow<string>('AI_MAX_TOKENS'));
    this.apiUrl = this.configService.getOrThrow<string>('AI_API_URL');
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
      throw new AIGenerationException(
        'В коллекции нет подходящих слов для генерации предложений.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const termsForSentencesGeneration = validCards.map((card) => card[cardSide]).join(', ');
    const translateTo = validCards.map((card) => (cardSide === 'word' ? card.translation : card.word)).join(', ');

    const systemPrompt = this.buildSystemPrompt(difficulty);
    const userPrompt = this.buildUserPrompt(termsForSentencesGeneration, count, translateTo, difficulty);

    const complexityTokens = {
      beginner: 1000,
      intermediate: 2000,
      advanced: 4000,
    };

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
          max_tokens: complexityTokens[difficulty] || this.maxTokens,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(`AI API error: ${response.status} - ${errorBody}`);
        if (response.status === 429) {
          throw new AIGenerationException(
            `Слишком много запросов. Пожалуйста, подождите минуту и попробуйте снова.`,
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        throw new AIGenerationException(
          `Не удалось сгенерировать предложения. Попробуйте позже или выберите другую коллекцию`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const data = (await response.json()) as GroqResponse;
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
- Каждое предложение должно быть естественным и ясно показывать использование терминов.
- Предложения должны быть полезны для метода интервальных повторений.
- Отвечай ТОЛЬКО валидным JSON, без markdown и лишнего текста.
- Не добавляй комментарии, объяснения или форматирование.
Формат ответа:
{
  "sentences": [
      {
      "terms": "исходные термины",
      "sentence": "Естественное предложение с использованием терминов",
      "translation": "Перевод предложения"
      }
  ]
}
`;
  }

  private buildUserPrompt(terms: string, count: number, translateTo: string, difficulty: string) {
    const difficultyMap = {
      beginner: 'начальный',
      intermediate: 'средний',
      advanced: 'продвинутый',
    };
    const difficultyGuidelines = {
      beginner: `
- Используй простую грамматику (настоящее время, простые предложения)
- Избегай сложных конструкций, деепричастий, страдательного залога
- Длина предложения: 5-10 слов
- Лексика должна быть базовой, соответствующей уровню A1-A2`,
      intermediate: `
- Можно использовать разные времена, условные предложения
- Допустимы причастные и деепричастные обороты
- Длина предложения: 8-15 слов
- Лексика уровня B1-B2`,
      advanced: `
- Допустимы любые грамматические конструкции
- Можно использовать идиомы, метафоры, сложные обороты
- Длина предложения: 10-25 слов
- Лексика уровня C1-C2, включая профессиональную терминологию`,
    };
    return `Создай ровно ${count} предложений, используя эти термины: ${terms}
Уровень сложности: ${difficultyMap[difficulty]}
${difficultyGuidelines[difficulty] || difficultyGuidelines.intermediate}

Требования:
- В одном предложении можно использовать несколько терминов, сохраняя естественный контекст
- Адаптируй сложность предложений под уровень ученика, но сохраняй осмысленность
- Если терминов меньше чем ${count}, добавь предложения с похожей лексикой соответствующего уровня
- Постарайся охватить все предоставленные термины в этих ${count} предложениях
- Предложения должны быть разнообразными и естественными
- Перевод каждого предложения должен быть на языке, на котором написаны эти термины: ${translateTo}
- Убедись, что перевод точный и соответствует контексту
- Все предложения и переводы должны быть грамматически правильными`;
  }
}
