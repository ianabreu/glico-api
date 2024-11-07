import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() { email, password, confirmationPassword }: RegisterDto) {
    return this.authService.register({ email, password, confirmationPassword });
  }
  @Post('login')
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login({ email, password });
  }
  @Get('profile')
  profile(@Req() req: Request) {
    const userId = req['userId'] as string;
    return this.authService.profile(userId);
  }
}
