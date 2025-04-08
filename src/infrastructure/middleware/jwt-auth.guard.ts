import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUseCasePort } from '../../core/ports/in/auth-use-case.port';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('AuthUseCasePort')
    private readonly authUseCase: AuthUseCasePort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.authUseCase.validateToken(token);
      
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      
      // Add user to request
      request.user = {
        id: payload.sub,
        email: payload.email,
      };
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
