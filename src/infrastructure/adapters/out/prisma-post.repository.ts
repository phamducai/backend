import { Injectable } from '@nestjs/common';
import { Post } from '../../../core/domain/post.entity';
import { PostRepositoryPort } from '../../../core/ports/out/post-repository.port';
import { PrismaService } from '../../config/prisma.service';

// Define a type that matches our domain model's expectations
type PrismaPostWithPublished = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaPostRepository implements PostRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Post | null> {
    const post = await this.prisma.posts.findUnique({
      where: { id }
    });

    if (!post) return null;

    // Cast the Prisma result to our expected type
    const postWithPublished = post as unknown as PrismaPostWithPublished;
    
    return Post.fromPersistence({
      id: postWithPublished.id,
      title: postWithPublished.title,
      content: postWithPublished.content,
      authorId: postWithPublished.authorId,
      published: Boolean(postWithPublished.published),
      createdAt: postWithPublished.createdAt,
      updatedAt: postWithPublished.updatedAt
    });
  }

  async findAll(options?: { limit?: number; offset?: number }): Promise<Post[]> {
    const posts = await this.prisma.posts.findMany({
      take: options?.limit,
      skip: options?.offset,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts.map(post => {
      // Cast each Prisma result to our expected type
      const postWithPublished = post as unknown as PrismaPostWithPublished;
      
      return Post.fromPersistence({
        id: postWithPublished.id,
        title: postWithPublished.title,
        content: postWithPublished.content,
        authorId: postWithPublished.authorId,
        published: Boolean(postWithPublished.published),
        createdAt: postWithPublished.createdAt,
        updatedAt: postWithPublished.updatedAt
      });
    });
  }

  async findByAuthorId(authorId: string): Promise<Post[]> {
    const posts = await this.prisma.posts.findMany({
      where: { authorId },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts.map(post => {
      // Cast each Prisma result to our expected type
      const postWithPublished = post as unknown as PrismaPostWithPublished;
      
      return Post.fromPersistence({
        id: postWithPublished.id,
        title: postWithPublished.title,
        content: postWithPublished.content,
        authorId: postWithPublished.authorId,
        published: Boolean(postWithPublished.published),
        createdAt: postWithPublished.createdAt,
        updatedAt: postWithPublished.updatedAt
      });
    });
  }

  async create(post: Post): Promise<Post> {
    // Create post using Prisma with explicit typing
    const createdPost = await this.prisma.posts.create({
      data: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        published: post.published,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      } as any // Use type assertion only where needed
    });

    // Cast the created post to our expected type
    const postWithPublished = createdPost as unknown as PrismaPostWithPublished;
    
    return Post.fromPersistence({
      id: postWithPublished.id,
      title: postWithPublished.title,
      content: postWithPublished.content,
      authorId: postWithPublished.authorId,
      published: Boolean(postWithPublished.published),
      createdAt: postWithPublished.createdAt,
      updatedAt: postWithPublished.updatedAt
    });
  }

  async update(post: Post): Promise<Post> {
    // Update post using Prisma with explicit typing
    const updatedPost = await this.prisma.posts.update({
      where: { id: post.id },
      data: {
        title: post.title,
        content: post.content,
        published: post.published,
        updatedAt: post.updatedAt
      } as any // Use type assertion only where needed
    });

    // Cast the updated post to our expected type
    const postWithPublished = updatedPost as unknown as PrismaPostWithPublished;
    
    return Post.fromPersistence({
      id: postWithPublished.id,
      title: postWithPublished.title,
      content: postWithPublished.content,
      authorId: postWithPublished.authorId,
      published: Boolean(postWithPublished.published),
      createdAt: postWithPublished.createdAt,
      updatedAt: postWithPublished.updatedAt
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.posts.delete({
      where: { id }
    });
  }
}
