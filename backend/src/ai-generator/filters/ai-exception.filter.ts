import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AIGenerationException } from '../exceptions/ai-generation.exception';

@Catch(AIGenerationException)
export class AIExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AIExceptionFilter.name);

  catch(exception: AIGenerationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const body = exception.getResponse() as { message: string; errorType: string };

    this.logger.warn(`AI generation failed [${status}]: ${body.message}`);

    response.status(status).json({
      ...body,
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }
}
