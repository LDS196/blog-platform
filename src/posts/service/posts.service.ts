import { DomainException } from '../../core/exceptions/domain.exception';
import { NotFoundException } from '../../core/exceptions/not-found.exception';
import { PostQueryInput } from '../dto/post-query.input';
import { TPostInputDto } from '../dto/post.input.dto';
import { TPostOutputDto } from '../dto/post.output.dto';
import { postsRepository } from '../repositories/posts.repository';
import { mapToPostOutput } from '../routers/mappers/map-list-posts-to-output';
import { TPost } from '../types/post';

export const postsService = {
  async findMany(
    queryInput: PostQueryInput,
  ): Promise<{ posts: TPostOutputDto[]; totalCount: number }> {
    const { posts, totalCount } = await postsRepository.findMany(queryInput);
    return { posts: posts.map(mapToPostOutput), totalCount };
  },
  async findById(id: string): Promise<TPostOutputDto> {
    const post = await postsRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return mapToPostOutput(post);
  },
  async findByBlogId(
    blogId: string,
    queryInput: PostQueryInput,
  ): Promise<{ posts: TPostOutputDto[]; totalCount: number }> {
    const { posts, totalCount } = await postsRepository.findByBlogId(
      blogId,
      queryInput,
    );
    return { posts: posts.map(mapToPostOutput), totalCount };
  },
  async create(post: TPost): Promise<TPostOutputDto> {
    const createdPost = await postsRepository.create(post);
    if (!createdPost) {
      throw new DomainException('Post not created');
    }
    return mapToPostOutput(createdPost);
  },
  async delete(id: string): Promise<void> {
    const isDeleted = await postsRepository.delete(id);
    if (!isDeleted) {
      throw new NotFoundException('Post not found');
    }
  },
  async update(id: string, post: TPostInputDto): Promise<void> {
    const isUpdated = await postsRepository.update(id, post);
    if (!isUpdated) {
      throw new NotFoundException('Post not found');
    }
  },
};
