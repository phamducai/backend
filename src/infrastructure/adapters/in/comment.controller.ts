import { Body, Controller, Delete, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommentUseCasePort, CreateCommentDto } from '../../../core/ports/in/comment-use-case.port';
import { JwtAuthGuard } from '../../middleware/jwt-auth.guard';

@Controller('posts/:postId/comments')
export class CommentController {
  constructor(
    @Inject('CommentUseCasePort')
    private readonly commentUseCase: CommentUseCasePort
  ) {}

  @Get()
  async getCommentsByPostId(@Param('postId') postId: string) {
    return this.commentUseCase.getCommentsByPostId(postId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Req() req,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    // Ensure postId from URL is used
    createCommentDto.postId = postId;
    return this.commentUseCase.createComment(req.user.id, createCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Req() req, @Param('id') id: string) {
    await this.commentUseCase.deleteComment(req.user.id, id);
    return { message: 'Comment deleted successfully' };
  }
}
