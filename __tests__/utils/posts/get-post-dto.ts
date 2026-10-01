import { PostInputDto } from '../../../src/posts/dto/post.input.dto';

export function getPostDto(blogId: string): PostInputDto {
  return {
    title: 'Test post',
    shortDescription: 'Test short description',
    content: 'Test content',
    blogId,
  };
}
