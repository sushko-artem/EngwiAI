import { HttpException, HttpStatus } from '@nestjs/common';

export class AIGenerationException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(
      {
        message,
        errorType: 'AI_GENERATION_FAILED',
      },
      status,
    );
  }
}
