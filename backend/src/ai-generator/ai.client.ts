import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AIConfigService } from './ai-config.service';
import { AIChatOptions, AIMessage, AIResponse } from './types/ai.model.types';
import { AIGenerationException } from './exceptions/ai-generation.exception';

@Injectable()
export class AIClient {
  private readonly logger = new Logger(AIClient.name);

  constructor(private readonly aiConfig: AIConfigService) {}

  async chat(messages: AIMessage[], options: AIChatOptions = {}): Promise<AIResponse> {
    const { maxTokens = this.aiConfig.maxTokens, temperature = 0.7, jsonMode = true } = options;
    let response: Response;

    try {
      response = await fetch(this.aiConfig.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.aiConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.aiConfig.model,
          messages,
          temperature,
          max_tokens: maxTokens,
          ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
        }),
        signal: AbortSignal.timeout(60_000),
      });
    } catch (error) {
      this.logger.error(`AI API request failed: ${error}`);
      throw new AIGenerationException('AI-сервис недоступен. Попробуйте позже.', HttpStatus.SERVICE_UNAVAILABLE);
    }

    if (!response.ok) {
      await this.handleError(response);
    }
    return (await response.json()) as AIResponse;
  }

  private async handleError(response: Response): Promise<never> {
    const errorBody = await response.text();
    this.logger.error(`AI API error: ${response.status} - ${errorBody}`);
    if (response.status === 429) {
      throw new AIGenerationException(
        `Слишком много запросов. Пожалуйста, подождите минуту и попробуйте снова.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (response.status === 402) {
      throw new AIGenerationException(
        `Лимит токенов закончился. Необходимо пополнить баланс.`,
        HttpStatus.PAYMENT_REQUIRED,
      );
    }
    throw new AIGenerationException(
      `Не удалось сгенерировать предложения. Попробуйте позже или выберите другую коллекцию`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
