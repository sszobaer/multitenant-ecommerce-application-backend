import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './DTOs/register.dto';
import { LoginDto } from './DTOs/login.dto';
import { AcceptInviteDto } from './DTOs/accept-invite.dto';
import { RateLimit } from 'src/common/decorators/rate-limit.decorator';
import { RedisRateLimitGuard } from 'src/common/guards/redis-rate-limit.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseGuards(RedisRateLimitGuard)
  @RateLimit({ limit: 5, ttl: 60, keyPrefix: 'auth-register' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(RedisRateLimitGuard)
  @RateLimit({ limit: 2, ttl: 60, keyPrefix: 'auth-login' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('accept-invite')
  @UseGuards(RedisRateLimitGuard)
  @RateLimit({ limit: 5, ttl: 60, keyPrefix: 'auth-accept-invite' })
  acceptInvite(@Query('token') token: string,@Body() dto: AcceptInviteDto) {
    return this.authService.acceptInvite(token, dto);
  }
}
