import * as crypto from 'crypto';
import { IsNotEmpty, IsBoolean, IsString, IsUUID, IsDate, MinLength } from 'class-validator';

export class Post {
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  readonly content: string;

  @IsUUID()
  @IsNotEmpty()
  readonly authorId: string;

  @IsBoolean()
  readonly published: boolean;

  @IsDate()
  @IsNotEmpty()
  readonly createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  readonly updatedAt: Date;

  private constructor(
    id: string,
    title: string,
    content: string,
    authorId: string,
    published: boolean,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.authorId = authorId;
    this.published = published;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(props: {
    title: string;
    content: string;
    authorId: string;
    published?: boolean;
  }): Post {
    return new Post(
      crypto.randomUUID(),
      props.title.trim(),
      props.content.trim(),
      props.authorId,
      props.published ?? false,
      new Date(),
      new Date()
    );
  }

  static fromPersistence(data: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Post {
    return new Post(
      data.id,
      data.title,
      data.content,
      data.authorId,
      data.published,
      data.createdAt,
      data.updatedAt
    );
  }

  publish(): Post {
    if (this.published) return this;
    
    return new Post(
      this.id,
      this.title,
      this.content,
      this.authorId,
      true,
      this.createdAt,
      new Date()
    );
  }

  unpublish(): Post {
    if (!this.published) return this;
    
    return new Post(
      this.id,
      this.title,
      this.content,
      this.authorId,
      false,
      this.createdAt,
      new Date()
    );
  }

  update(props: { title?: string; content?: string }): Post {
    return new Post(
      this.id,
      props.title?.trim() || this.title,
      props.content?.trim() || this.content,
      this.authorId,
      this.published,
      this.createdAt,
      new Date()
    );
  }

  isOwnedBy(userId: string): boolean {
    return this.authorId === userId;
  }
}
