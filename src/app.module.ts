import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './infrastructure/modules/auth.module';
import { PostModule } from './infrastructure/modules/post.module';
import { CommentModule } from './infrastructure/modules/comment.module';
import { PrismaModule } from './infrastructure/modules/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    PostModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
