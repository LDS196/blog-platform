import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { PostInputDto } from '../../../src/posts/dto/post.input.dto';
import { POSTS_PATH } from '../../../src/posts/constants/posts.paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';
import { createBlog } from '../../utils/blogs/create-blog';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPost } from '../../utils/posts/create-post';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { BlogOutputDto } from '../../../src/blogs/dto/blog.output.dto';

describe('Post API body validation check', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();
  let blog: BlogOutputDto;
  let correctDto: PostInputDto;

  beforeAll(async () => {
    await clearDb(app);
    blog = await createBlog(app);
    correctDto = getPostDto(blog.id);
  });

  it('❌ should return 401 without auth; POST /api/posts', async () => {
    await request(app)
      .post(POSTS_PATH)
      .send(correctDto)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not create post when incorrect body passed; POST /api/posts', async () => {
    const invalidDataSet1 = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send({
        title: '',
        shortDescription: '',
        content: '',
        blogId: 'missing-blog',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctDto,
        title: 't'.repeat(31),
        shortDescription: 's'.repeat(101),
        content: 'c'.repeat(1001),
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(3);

    const invalidDataSet3 = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send({ ...correctDto, title: 't'.repeat(31) })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);

    const postListResponse = await request(app).get(POSTS_PATH);
    expect(postListResponse.body).toHaveLength(0);
  });

  it('❌ should not create post when blogId does not exist; POST /api/posts', async () => {
    await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send({ ...correctDto, blogId: crypto.randomUUID() })
      .expect(HttpStatus.BadRequest);
  });

  it('❌ should not update post when incorrect data passed; PUT /api/posts/:id', async () => {
    const createdPost = await createPost(app, blog.id, correctDto);
    const createdId = createdPost.id;

    const invalidDataSet1 = await request(app)
      .put(`${POSTS_PATH}/${createdId}`)
      .set('Authorization', adminToken)
      .send({
        title: '',
        shortDescription: '',
        content: '',
        blogId: 'missing-blog',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`${POSTS_PATH}/${createdId}`)
      .set('Authorization', adminToken)
      .send({ ...correctDto, title: 't'.repeat(31) })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);

    const postResponse = await getPostById(app, createdId);
    expect(postResponse).toEqual(createdPost);
  });
});
