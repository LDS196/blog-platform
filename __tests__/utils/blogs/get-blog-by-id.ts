import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { BlogOutputDto } from '../../../src/blogs/dto/blog.output.dto';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs.paths';

export async function getBlogById(
  app: Express,
  blogId: string,
): Promise<BlogOutputDto> {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .expect(HttpStatus.Ok);

  return blogResponse.body;
}
