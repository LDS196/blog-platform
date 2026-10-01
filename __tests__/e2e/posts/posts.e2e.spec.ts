import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { PostInputDto } from '../../../src/posts/dto/post.input.dto';
import { POSTS_PATH } from '../../../src/posts/constants/posts.paths';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs.paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';
import { createBlog } from '../../utils/blogs/create-blog';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { createPost } from '../../utils/posts/create-post';
import { getPostById } from '../../utils/posts/get-post-by-id';
import { updatePost } from '../../utils/posts/update-post';

describe('Post API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it('✅ should create post; POST /api/posts', async () => {
    const blog = await createBlog(app);
    const newPost: PostInputDto = {
      ...getPostDto(blog.id),
      title: 'New post',
    };

    const createdPost = await createPost(app, blog.id, newPost);

    expect(createdPost).toEqual({
      id: expect.any(String),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: blog.id,
      blogName: blog.name,
    });
  });

  it('✅ should return posts list; GET /api/posts', async () => {
    const blog = await createBlog(app);
    await createPost(app, blog.id);
    await createPost(app, blog.id);

    const response = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('✅ should return post by id; GET /api/posts/:id', async () => {
    const blog = await createBlog(app);
    const createdPost = await createPost(app, blog.id);

    const post = await getPostById(app, createdPost.id);

    expect(post).toEqual(createdPost);
  });

  it('✅ should update post; PUT /api/posts/:id', async () => {
    const blog = await createBlog(app);
    const createdPost = await createPost(app, blog.id);

    const postUpdateData: PostInputDto = {
      title: 'Updated post',
      shortDescription: 'Updated short description',
      content: 'Updated content',
      blogId: blog.id,
    };

    await updatePost(app, createdPost.id, blog.id, postUpdateData);

    const postResponse = await getPostById(app, createdPost.id);

    expect(postResponse).toEqual({
      id: createdPost.id,
      title: postUpdateData.title,
      shortDescription: postUpdateData.shortDescription,
      content: postUpdateData.content,
      blogId: blog.id,
      blogName: blog.name,
    });
  });

  it('✅ should delete post and check after "NOT FOUND"; DELETE /api/posts/:id', async () => {
    const blog = await createBlog(app);
    const createdPost = await createPost(app, blog.id);

    await request(app)
      .delete(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${POSTS_PATH}/${createdPost.id}`)
      .expect(HttpStatus.NotFound);
  });

  it('✅ should create post for blog; POST /api/blogs/:id/posts', async () => {
    const blog = await createBlog(app);
    const { blogId, ...postByBlogDto } = getPostDto(blog.id);

    const response = await request(app)
      .post(`${BLOGS_PATH}/${blog.id}/posts`)
      .set('Authorization', adminToken)
      .send(postByBlogDto)
      .expect(HttpStatus.Created);

    expect(response.body).toEqual({
      id: expect.any(String),
      ...postByBlogDto,
      blogId: blog.id,
      blogName: blog.name,
    });
    expect(blogId).toBe(blog.id);
  });

  it('✅ should return posts by blog id; GET /api/blogs/:id/posts', async () => {
    const blog = await createBlog(app);
    await createPost(app, blog.id);
    await createPost(app, blog.id);

    const response = await request(app)
      .get(`${BLOGS_PATH}/${blog.id}/posts`)
      .expect(HttpStatus.Ok);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
    expect(
      response.body.every((post: { blogId: string }) => post.blogId === blog.id),
    ).toBe(true);
  });

  it('❌ should return 404 for posts of missing blog; GET /api/blogs/:id/posts', async () => {
    await request(app)
      .get(`${BLOGS_PATH}/${crypto.randomUUID()}/posts`)
      .expect(HttpStatus.NotFound);
  });
});
