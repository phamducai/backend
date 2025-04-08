import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../../core/application/auth.service';
import { AuthController } from '../adapters/in/auth.controller';
import { PrismaUserRepository } from '../adapters/out/prisma-user.repository';
import { jwtConfig } from '../config/jwt.config';
import { PrismaModule } from './prisma.module';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'UserRepositoryPort',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'AuthUseCasePort',
      useClass: AuthService,
    },
    JwtAuthGuard,
  ],
  exports: [
    {
      provide: 'AuthUseCasePort',
      useClass: AuthService,
    },
    JwtModule,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
