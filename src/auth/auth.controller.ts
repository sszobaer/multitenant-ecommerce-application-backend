import { Controller, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './DTOs/register.dto';
import { LoginDto } from './DTOs/login.dto';
import { AcceptInviteDto } from './DTOs/accept-invite.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('accept-invite')
  acceptInvite(@Query('token') token: string,@Body() dto: AcceptInviteDto) {
    return this.authService.acceptInvite(token, dto);
  }
}