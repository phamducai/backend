import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';
import { Comment } from '../../domain/comment.entity';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;

  @IsUUID()
  @IsNotEmpty()
  postId: string;
}

export interface CommentUseCasePort {
  getCommentsByPostId(postId: string): Promise<Comment[]>;
  createComment(userId: string, commentData: CreateCommentDto): Promise<Comment>;
  deleteComment(userId: string, commentId: string): Promise<void>;
}
