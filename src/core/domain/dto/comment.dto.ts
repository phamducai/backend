import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * DTO for returning comment information
 */
export class CommentDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  postId: string;

  @IsUUID()
  authorId: string;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating a new comment
 */
export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @IsUUID()
  @IsNotEmpty()
  postId: string;
}

/**
 * DTO for updating an existing comment
 */
export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content?: string;
}
