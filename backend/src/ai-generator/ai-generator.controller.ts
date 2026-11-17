import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AIExceptionFilter } from './filters/ai-exception.filter';
import { AIService } from './ai-generator.service';
import { GenerateSentencesDto } from './DTO/generate-sentences.dto';
import { GetCurrentUser } from '@common/decorators';
import { User } from '@generated/prisma/client';

@Controller('ai')
@UseFilters(AIExceptionFilter)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('generate-sentences')
  async generateSentences(@Body() dto: GenerateSentencesDto, @GetCurrentUser() user: User) {
    return await this.aiService.generateSentences(user.id, dto);
  }
}
