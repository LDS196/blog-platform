import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { TPostInputDto } from '../../../src/posts/dto/post.input.dto';
import { TPostOutputDto } from '../../../src/posts/dto/post.output.dto';
import { POSTS_PATH } from '../../../src/posts/constants/posts.paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { getPostDto } from './get-post-dto';

export async function createPost(
  app: Express,
  blogId: string,
  postDto?: Partial<TPostInputDto>,
): Promise<TPostOutputDto> {
  const testPostData: TPostInputDto = { ...getPostDto(blogId), ...postDto };

  const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);

  return createdPostResponse.body;
}
