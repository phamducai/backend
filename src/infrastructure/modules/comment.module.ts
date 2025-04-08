import { Module } from '@nestjs/common';
import { CommentService } from '../../core/application/comment.service';
import { CommentController } from '../adapters/in/comment.controller';
import { PrismaCommentRepository } from '../adapters/out/prisma-comment.repository';
import { PrismaPostRepository } from '../adapters/out/prisma-post.repository';
import { AuthModule } from './auth.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [CommentController],
  providers: [
    {
      provide: 'CommentRepositoryPort',
      useClass: PrismaCommentRepository,
    },
    {
      provide: 'PostRepositoryPort',
      useClass: PrismaPostRepository,
    },
    {
      provide: 'CommentUseCasePort',
      useClass: CommentService,
    },
  ],
})
export class CommentModule {}
