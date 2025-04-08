import { Post } from '../../domain/post.entity';

export interface PostRepositoryPort {
  findById(id: string): Promise<Post | null>;
  findAll(options?: { limit?: number; offset?: number }): Promise<Post[]>;
  findByAuthorId(authorId: string): Promise<Post[]>;
  create(post: Post): Promise<Post>;
  update(post: Post): Promise<Post>;
  delete(id: string): Promise<void>;
}
