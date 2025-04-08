import { Injectable, Inject } from '@nestjs/common';
import { validate } from 'class-validator';
import { Comment } from '../domain/comment.entity';
import { CommentRepositoryPort } from '../ports/out/comment-repository.port';
import { PostRepositoryPort } from '../ports/out/post-repository.port';
import { CommentUseCasePort, CreateCommentDto } from '../ports/in/comment-use-case.port';

@Injectable()
export class CommentService implements CommentUseCasePort {
  constructor(
    @Inject('CommentRepositoryPort')
    private readonly commentRepository: CommentRepositoryPort,
    @Inject('PostRepositoryPort')
    private readonly postRepository: PostRepositoryPort,
  ) {}

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    // Check if post exists
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Get comments
    return this.commentRepository.findByPostId(postId);
  }

  async createComment(userId: string, commentData: CreateCommentDto): Promise<Comment> {
    // Validate DTO
    const errors = await validate(commentData);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    // Check if post exists
    const post = await this.postRepository.findById(commentData.postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Check if post is published
    if (!post.published) {
      throw new Error('Cannot comment on unpublished posts');
    }
    
    // Create comment
    const comment = Comment.create(
      commentData.content,
      commentData.postId,
      userId
    );
    
    // Save comment
    return this.commentRepository.create(comment);
  }

  async deleteComment(userId: string, commentId: string): Promise<void> {
    // Find comment
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }
    
    // Check ownership
    if (!comment.isOwnedBy(userId)) {
      throw new Error('You are not authorized to delete this comment');
    }
    
    // Delete comment
    await this.commentRepository.delete(commentId);
  }
}
