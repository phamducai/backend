import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { Post } from '../../domain/post.entity';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  content?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}

export interface PostUseCasePort {
  getAllPosts(options?: { limit?: number; offset?: number }): Promise<Post[]>;
  getPostById(id: string): Promise<Post>;
  createPost(userId: string, postData: CreatePostDto): Promise<Post>;
  updatePost(userId: string, postId: string, postData: UpdatePostDto): Promise<Post>;
  deletePost(userId: string, postId: string): Promise<void>;
  publishPost(userId: string, postId: string): Promise<Post>;
  unpublishPost(userId: string, postId: string): Promise<Post>;
}
