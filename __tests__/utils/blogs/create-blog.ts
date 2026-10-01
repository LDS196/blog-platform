import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { BlogInputDto } from '../../../src/blogs/dto/blog.input.dto';
import { BlogOutputDto } from '../../../src/blogs/dto/blog.output.dto';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs.paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { getBlogDto } from './get-blog-dto';

export async function createBlog(
  app: Express,
  blogDto?: Partial<BlogInputDto>,
): Promise<BlogOutputDto> {
  const testBlogData: BlogInputDto = { ...getBlogDto(), ...blogDto };

  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  return createdBlogResponse.body;
}
