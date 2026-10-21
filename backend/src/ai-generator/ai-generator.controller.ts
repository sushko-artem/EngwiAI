import { Body, Controller, Post, Get, UseFilters } from '@nestjs/common';
import { AIExceptionFilter } from './filters/ai-exception.filter';
import { AIService } from './ai-generator.service';
import { GenerateSentencesDto } from './DTO/generate-sentences.dto';
import { GetCurrentUser, Public } from '@common/decorators';
import { User } from '@generated/prisma/client';
import { AIConfigService } from './ai-config.service';

@Controller('ai')
@UseFilters(AIExceptionFilter)
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly aiConfig: AIConfigService,
  ) {}

  @Public()
  @Get('mode')
  getMode() {
    return { isMockMode: !this.aiConfig.enabled };
  }

  @Post('generate-sentences')
  async generateSentences(@Body() dto: GenerateSentencesDto, @GetCurrentUser() user: User) {
    return await this.aiService.generateSentences(user.id, dto);
  }
}
