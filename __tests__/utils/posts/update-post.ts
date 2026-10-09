import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { TPostInputDto } from '../../../src/posts/dto/post.input.dto';
import { POSTS_PATH } from '../../../src/posts/constants/posts.paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { getPostDto } from './get-post-dto';

export async function updatePost(
  app: Express,
  postId: string,
  blogId: string,
  postDto?: Partial<TPostInputDto>,
): Promise<void> {
  const testPostData: TPostInputDto = { ...getPostDto(blogId), ...postDto };

  await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.NoContent);
}
