import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@user/user.module';
import { TokensModule } from '../tokens/tokens.module';
import { PassportModule } from '@nestjs/passport';
import { STRATEGIES, GoogleStrategy } from './strategies';
import { GUARDS } from './guards';

const googleEnabled = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

if (process.env.NODE_ENV === 'production' && !googleEnabled) {
  throw new Error('Google OAuth env vars are required in production');
}

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...(googleEnabled ? [GoogleStrategy] : []), ...STRATEGIES, ...GUARDS],
  imports: [UserModule, TokensModule, PassportModule.register({ defaultStrategy: 'jwt' })],
})
export class AuthModule {}
