import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { CreatePostDto, PostUseCasePort, UpdatePostDto } from '../../../core/ports/in/post-use-case.port';
import { JwtAuthGuard } from '../../middleware/jwt-auth.guard';

@Controller('posts')
export class PostController {
  constructor(
    @Inject('PostUseCasePort')
    private readonly postUseCase: PostUseCasePort
  ) {}

  @Get()
  async getAllPosts(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.postUseCase.getAllPosts({ limit, offset });
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postUseCase.getPostById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Req() req, @Body() createPostDto: CreatePostDto) {
    return this.postUseCase.createPost(req.user.id, createPostDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Req() req,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postUseCase.updatePost(req.user.id, id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Req() req, @Param('id') id: string) {
    await this.postUseCase.deletePost(req.user.id, id);
    return { message: 'Post deleted successfully' };
  }

  @Put(':id/publish')
  @UseGuards(JwtAuthGuard)
  async publishPost(@Req() req, @Param('id') id: string) {
    return this.postUseCase.publishPost(req.user.id, id);
  }

  @Put(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  async unpublishPost(@Req() req, @Param('id') id: string) {
    return this.postUseCase.unpublishPost(req.user.id, id);
  }
}
