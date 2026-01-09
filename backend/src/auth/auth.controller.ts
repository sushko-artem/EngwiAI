import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './DTO';
import { Request, Response } from 'express';
import { Cookie, Public, UserAgent } from '@common/decorators';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Itokens } from './interfaces';
import { GoogleGuard } from './guards/google.guard';
import { User } from '@generated/prisma/client';
import { TokensService } from 'src/tokens/tokens.service';
import { UserService } from '@user/user.service';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get('health')
  @HttpCode(200)
  health() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }

  @Get('me')
  async getMe(@Cookie('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    try {
      const payload = await this.tokensService.verifyRefreshToken(refreshToken);
      const user = await this.userService.findOne(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterUserDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
    @UserAgent() userAgent: string,
  ) {
    const tokens = await this.authService.login(dto, userAgent);
    this.saveTokensToCookies(tokens, response);
    return { message: 'Login successful' };
  }

  @Get('logout')
  async logout(@Cookie('refreshToken') refreshToken: string, @Res({ passthrough: true }) response: Response) {
    await this.authService.deleteRefreshToken(refreshToken);
    this.deleteTokensFromCookies(response);
    return { message: 'Logged out successfully' };
  }

  @Get('refresh')
  async refresh(
    @Cookie('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
    @UserAgent() userAgent: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const tokens = await this.authService.refersh(refreshToken, userAgent);
    this.saveTokensToCookies(tokens, response);
    return { message: 'Token refreshed' };
  }

  @UseGuards(GoogleGuard)
  @Get('google')
  googleAuth() {}

  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleAuthCallback(@Req() request: Request, @Res() response: Response, @UserAgent() userAgent: string) {
    const user = request.user as User;
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
    const tokens = await this.authService.googleAuthGenerateTokens(payload, userAgent);
    this.saveTokensToCookies(tokens, response);
    return response.redirect(`${this.configService.get('FRONTEND_URL')}/dashboard`);
  }

  private saveTokensToCookies(tokens: Itokens, response: Response) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: ms(this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES')),
      path: '/',
    });
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: ms(this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES')),
      path: '/',
    });
  }

  private deleteTokensFromCookies(response: Response) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    response.cookie('accessToken', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      expires: new Date(0),
    });
    response.cookie('refreshToken', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      expires: new Date(0),
    });
  }
}
