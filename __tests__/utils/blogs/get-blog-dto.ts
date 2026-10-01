import { BlogInputDto } from '../../../src/blogs/dto/blog.input.dto';

export function getBlogDto(): BlogInputDto {
  return {
    name: 'Test blog',
    description: 'Test description',
    websiteUrl: 'https://example.com',
  };
}
