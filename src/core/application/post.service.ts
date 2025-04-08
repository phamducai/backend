import { Injectable, Inject } from '@nestjs/common';
import { validate } from 'class-validator';
import { Post } from '../domain/post.entity';
import { PostRepositoryPort } from '../ports/out/post-repository.port';
import { UserRepositoryPort } from '../ports/out/user-repository.port';
import { CreatePostDto, PostUseCasePort, UpdatePostDto } from '../ports/in/post-use-case.port';

@Injectable()
export class PostService implements PostUseCasePort {
  constructor(
    @Inject('PostRepositoryPort')
    private readonly postRepository: PostRepositoryPort,
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async getAllPosts(options?: { limit?: number; offset?: number }): Promise<Post[]> {
    return this.postRepository.findAll(options);
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.postRepository.findById(id);
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    return post;
  }

  async createPost(userId: string, postData: CreatePostDto): Promise<Post> {
    // Validate DTO
    const errors = await validate(postData);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create post
    const post = Post.create({
      title: postData.title,
      content: postData.content,
      authorId: userId,
      published: postData.published ?? false,
    });
    
    // Save post
    return this.postRepository.create(post);
  }

  async updatePost(userId: string, postId: string, postData: UpdatePostDto): Promise<Post> {
    // Validate DTO
    const errors = await validate(postData);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    // Find post
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Check ownership
    if (!post.isOwnedBy(userId)) {
      throw new Error('You are not authorized to update this post');
    }
    
    // Update post
    let updatedPost = post;
    
    // Update title/content if provided
    if (postData.title !== undefined || postData.content !== undefined) {
      updatedPost = post.update({
        title: postData.title,
        content: postData.content,
      });
    }
    
    // Update published status if provided
    if (postData.published !== undefined) {
      updatedPost = postData.published ? updatedPost.publish() : updatedPost.unpublish();
    }
    
    // Save updated post
    return this.postRepository.update(updatedPost);
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    // Find post
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Check ownership
    if (!post.isOwnedBy(userId)) {
      throw new Error('You are not authorized to delete this post');
    }
    
    // Delete post
    await this.postRepository.delete(postId);
  }

  async publishPost(userId: string, postId: string): Promise<Post> {
    // Find post
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Check ownership
    if (!post.isOwnedBy(userId)) {
      throw new Error('You are not authorized to publish this post');
    }
    
    // Publish post
    const publishedPost = post.publish();
    
    // Save published post
    return this.postRepository.update(publishedPost);
  }

  async unpublishPost(userId: string, postId: string): Promise<Post> {
    // Find post
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Check ownership
    if (!post.isOwnedBy(userId)) {
      throw new Error('You are not authorized to unpublish this post');
    }
    
    // Unpublish post
    const unpublishedPost = post.unpublish();
    
    // Save unpublished post
    return this.postRepository.update(unpublishedPost);
  }
}
