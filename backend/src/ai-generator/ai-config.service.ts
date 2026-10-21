import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AIConfigService {
  private readonly logger = new Logger(AIConfigService.name);
  readonly apiKey: string;
  readonly apiUrl: string;
  readonly model: string;
  readonly maxTokens: number;
  readonly enabled: boolean;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('AI_API_KEY') ?? '';
    this.apiUrl = this.configService.get<string>('AI_API_URL') ?? '';
    this.model = this.configService.get<string>('AI_MODEL') ?? 'mock';
    this.maxTokens = Number(this.configService.get<string>('AI_MAX_TOKENS') ?? 2000);
    this.enabled = !!this.apiKey && !!this.apiUrl;

    if (!this.enabled && this.configService.get('NODE_ENV') === 'production') {
      throw new Error('AI_API_KEY и AI_API_URL обязательны в production-режиме.');
    }

    if (!this.enabled) {
      this.logger.warn(
        'AI_API_KEY или AI_API_URL не заданы - AIService работает в mock-режиме (development). Генерация предложений будет возвращать заглушку.',
      );
    }
  }
}
