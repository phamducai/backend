import { Module } from '@nestjs/common';
import { PostService } from '../../core/application/post.service';
import { PostController } from '../adapters/in/post.controller';
import { PrismaPostRepository } from '../adapters/out/prisma-post.repository';
import { PrismaUserRepository } from '../adapters/out/prisma-user.repository';
import { AuthModule } from './auth.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [PostController],
  providers: [
    {
      provide: 'PostRepositoryPort',
      useClass: PrismaPostRepository,
    },
    {
      provide: 'UserRepositoryPort',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'PostUseCasePort',
      useClass: PostService,
    },
  ],
  exports: [
    {
      provide: 'PostRepositoryPort',
      useClass: PrismaPostRepository,
    },
    {
      provide: 'PostUseCasePort',
      useClass: PostService,
    },
  ],
})
export class PostModule {}
