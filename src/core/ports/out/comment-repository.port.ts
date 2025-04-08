import { Comment } from '../../domain/comment.entity';

export interface CommentRepositoryPort {
  findById(id: string): Promise<Comment | null>;
  findByPostId(postId: string): Promise<Comment[]>;
  create(comment: Comment): Promise<Comment>;
  delete(id: string): Promise<void>;
}
