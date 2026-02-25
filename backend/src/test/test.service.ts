import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class TestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async reset() {
    if (this.configService.getOrThrow<string>('NODE_ENV') !== 'test') {
      throw new ForbiddenException('Not available');
    }
    await this.prisma.user.deleteMany();
  }
}
