import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthUseCasePort, LoginUserDto, RegisterUserDto } from '../../../core/ports/in/auth-use-case.port';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthUseCasePort')
    private readonly authUseCase: AuthUseCasePort
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    return this.authUseCase.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return this.authUseCase.login(loginDto);
  }
}
