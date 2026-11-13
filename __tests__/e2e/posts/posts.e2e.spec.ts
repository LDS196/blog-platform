import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { TPostInputDto } from '../../../src/posts/dto/post.input.dto';
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

  beforeEach(async () => {
    await clearDb(app);
  });

  it('✅ should create post; POST /api/posts', async () => {
    const blog = await createBlog(app);
    const newPost: TPostInputDto = {
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
      createdAt: expect.any(String),
    });
  });

  it('✅ should return posts list; GET /api/posts', async () => {
    const blog = await createBlog(app);
    const firstPost = await createPost(app, blog.id);
    const secondPost = await createPost(app, blog.id);

    const response = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);

    expect(response.body).toMatchObject({
      page: 1,
      pageSize: 10,
      pageCount: 1,
      totalCount: 2,
    });
    expect(response.body.items.map((post: { id: string }) => post.id)).toEqual(
      expect.arrayContaining([firstPost.id, secondPost.id]),
    );
  });

  it('✅ should paginate posts; GET /api/posts?pageNumber&pageSize', async () => {
    const blog = await createBlog(app);
    const firstPost = await createPost(app, blog.id, { title: 'pg-1' });
    await new Promise((resolve) => setTimeout(resolve, 10));
    const secondPost = await createPost(app, blog.id, { title: 'pg-2' });

    const query = {
      pageSize: 1,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    };

    const page1 = await request(app)
      .get(POSTS_PATH)
      .query({ ...query, pageNumber: 1 })
      .expect(HttpStatus.Ok);

    expect(page1.body).toMatchObject({
      page: 1,
      pageSize: 1,
      totalCount: 2,
      pageCount: 2,
      items: [expect.objectContaining({ id: firstPost.id })],
    });

    const page2 = await request(app)
      .get(POSTS_PATH)
      .query({ ...query, pageNumber: 2 })
      .expect(HttpStatus.Ok);

    expect(page2.body.items).toEqual([
      expect.objectContaining({ id: secondPost.id }),
    ]);
  });

  it('✅ should sort posts by createdAt; GET /api/posts?sortBy&sortDirection', async () => {
    const blog = await createBlog(app);
    const olderPost = await createPost(app, blog.id, { title: 'older' });
    await new Promise((resolve) => setTimeout(resolve, 10));
    const newerPost = await createPost(app, blog.id, { title: 'newer' });

    const response = await request(app)
      .get(POSTS_PATH)
      .query({ sortBy: 'createdAt', sortDirection: 'desc', pageSize: 10 })
      .expect(HttpStatus.Ok);

    expect(response.body.items.map((post: { id: string }) => post.id)).toEqual([
      newerPost.id,
      olderPost.id,
    ]);
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

    const postUpdateData: TPostInputDto = {
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
      createdAt: createdPost.createdAt,
    });
  });

  it('✅ should keep post when update body is unchanged; PUT /api/posts/:id', async () => {
    const blog = await createBlog(app);
    const createdPost = await createPost(app, blog.id);

    await request(app)
      .put(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', adminToken)
      .send({
        title: createdPost.title,
        shortDescription: createdPost.shortDescription,
        content: createdPost.content,
        blogId: createdPost.blogId,
      })
      .expect(HttpStatus.NoContent);

    const post = await getPostById(app, createdPost.id);
    expect(post).toEqual(createdPost);
  });

  it('❌ should return 404 for invalid post id; GET /api/posts/:id', async () => {
    const response = await request(app)
      .get(`${POSTS_PATH}/not-an-id`)
      .expect(HttpStatus.NotFound);

    expect(response.body.errorsMessages[0].field).toBe('id');
  });

  it('❌ should return 404 when deleting missing post; DELETE /api/posts/:id', async () => {
    await request(app)
      .delete(`${POSTS_PATH}/507f1f77bcf86cd799439011`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
  });

  it('✅ should delete blog posts together with the blog; DELETE /api/blogs/:id', async () => {
    const blog = await createBlog(app);
    const createdPost = await createPost(app, blog.id);

    await request(app)
      .delete(`${BLOGS_PATH}/${blog.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${POSTS_PATH}/${createdPost.id}`)
      .expect(HttpStatus.NotFound);
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
      createdAt: expect.any(String),
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
      response.body.every(
        (post: { blogId: string }) => post.blogId === blog.id,
      ),
    ).toBe(true);
  });

  it('❌ should return 404 for posts of missing blog; GET /api/blogs/:id/posts', async () => {
    await request(app)
      .get(`${BLOGS_PATH}/${crypto.randomUUID()}/posts`)
      .expect(HttpStatus.NotFound);
  });
});
