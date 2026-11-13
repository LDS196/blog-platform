import { DomainException } from '../../core/exceptions/domain.exception';
import { NotFoundException } from '../../core/exceptions/not-found.exception';
import { postsRepository } from '../../posts/repositories/posts.repository';
import { blogsRepository } from '../repositories/blogs.repository';
import { BlogQueryInput } from '../dto/blog-query.input';
import { TBlogInputDto } from '../dto/blog.input.dto';
import { mapToBlogOutput } from '../routers/mappers/map-list-blogs-to-output';
import { TBlogOutputDto } from '../dto/blog.output.dto';

export const blogsService = {
  async findMany(query: BlogQueryInput): Promise<{
    blogs: TBlogOutputDto[];
    totalCount: number;
  }> {
    const { items, totalCount } = await blogsRepository.findMany(query);
    return {
      blogs: items.map(mapToBlogOutput),
      totalCount,
    };
  },
  async findById(id: string): Promise<TBlogOutputDto> {
    const blog = await blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    return mapToBlogOutput(blog);
  },
  async create(blog: TBlogInputDto): Promise<TBlogOutputDto> {
    const createdBlog = await blogsRepository.create({
      ...blog,
      createdAt: new Date().toISOString(),
      isMembership: false,
    });
    if (!createdBlog) {
      throw new DomainException('Blog not created');
    }
    return mapToBlogOutput(createdBlog);
  },
  async delete(id: string): Promise<void> {
    const isDeleted = await blogsRepository.delete(id);
    if (!isDeleted) {
      throw new NotFoundException('Blog not found');
    }
    await postsRepository.deleteByBlogId(id);
  },
  async update(id: string, blog: TBlogInputDto): Promise<void> {
    const isUpdated = await blogsRepository.update(id, blog);
    if (!isUpdated) {
      throw new NotFoundException('Blog not found');
    }
  },
};
