import { Controller, HttpCode, Post } from '@nestjs/common';
import { TestService } from './test.service';
import { Public } from '@common/decorators';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}
  @Public()
  @Post('reset-db')
  @HttpCode(200)
  async resetDatabase() {
    await this.testService.reset();
    return { message: 'Database reset successful' };
  }
}
