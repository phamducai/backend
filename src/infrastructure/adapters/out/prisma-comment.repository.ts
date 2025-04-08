import { Injectable } from '@nestjs/common';
import { Comment } from '../../../core/domain/comment.entity';
import { CommentRepositoryPort } from '../../../core/ports/out/comment-repository.port';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class PrismaCommentRepository implements CommentRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Comment | null> {
    const comment = await this.prisma.comments.findUnique({
      where: { id }
    });

    if (!comment) return null;

    return Comment.fromPersistence({
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      authorId: comment.authorId,
      createdAt: comment.createdAt
    });
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    const comments = await this.prisma.comments.findMany({
      where: { postId },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return comments.map(comment => Comment.fromPersistence({
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      authorId: comment.authorId,
      createdAt: comment.createdAt
    }));
  }

  async create(comment: Comment): Promise<Comment> {
    const createdComment = await this.prisma.comments.create({
      data: {
        id: comment.id,
        content: comment.content,
        postId: comment.postId,
        authorId: comment.authorId,
        createdAt: comment.createdAt
      }
    });

    return Comment.fromPersistence({
      id: createdComment.id,
      content: createdComment.content,
      postId: createdComment.postId,
      authorId: createdComment.authorId,
      createdAt: createdComment.createdAt
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comments.delete({
      where: { id }
    });
  }
}
