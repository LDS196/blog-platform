import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { TBlogInputDto } from '../../../src/blogs/dto/blog.input.dto';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs.paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { getBlogDto } from './get-blog-dto';

export async function updateBlog(
  app: Express,
  blogId: string,
  blogDto?: Partial<TBlogInputDto>,
): Promise<void> {
  const testBlogData: TBlogInputDto = { ...getBlogDto(), ...blogDto };

  await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.NoContent);
}
