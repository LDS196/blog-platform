import { TBlogInputDto } from '../../../src/blogs/dto/blog.input.dto';

export function getBlogDto(): TBlogInputDto {
  return {
    name: 'Test blog',
    description: 'Test description',
    websiteUrl: 'https://example.com',
  };
}
