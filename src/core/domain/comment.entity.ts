import * as crypto from 'crypto';
import { IsNotEmpty, IsString, IsUUID, IsDate, MinLength } from 'class-validator';

export class Comment {
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly content: string;

  @IsUUID()
  @IsNotEmpty()
  readonly postId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly authorId: string;

  @IsDate()
  @IsNotEmpty()
  readonly createdAt: Date;

  private constructor(
    id: string,
    content: string,
    postId: string,
    authorId: string,
    createdAt: Date
  ) {
    this.id = id;
    this.content = content;
    this.postId = postId;
    this.authorId = authorId;
    this.createdAt = createdAt;
  }

  static create(content: string, postId: string, authorId: string): Comment {
    return new Comment(
      crypto.randomUUID(),
      content.trim(),
      postId,
      authorId,
      new Date()
    );
  }

  static fromPersistence(data: {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    createdAt: Date;
  }): Comment {
    return new Comment(
      data.id,
      data.content,
      data.postId,
      data.authorId,
      data.createdAt
    );
  }

  isOwnedBy(userId: string): boolean {
    return this.authorId === userId;
  }
}
