import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { TBlogInputDto } from '../../../src/blogs/dto/blog.input.dto';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs.paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';
import { updateBlog } from '../../utils/blogs/update-blog';

describe('Blog API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it('✅ should create blog; POST /api/blogs', async () => {
    const newBlog: TBlogInputDto = {
      ...getBlogDto(),
      name: 'New blog',
      websiteUrl: 'https://new-blog.com',
    };

    const createdBlog = await createBlog(app, newBlog);

    expect(createdBlog).toEqual({
      id: expect.any(String),
      ...newBlog,
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it('✅ should return blogs list; GET /api/blogs', async () => {
    await createBlog(app);
    await createBlog(app);

    const response = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('✅ should return blog by id; GET /api/blogs/:id', async () => {
    const createdBlog = await createBlog(app);

    const blog = await getBlogById(app, createdBlog.id);

    expect(blog).toEqual(createdBlog);
  });

  it('✅ should update blog; PUT /api/blogs/:id', async () => {
    const createdBlog = await createBlog(app);

    const blogUpdateData: TBlogInputDto = {
      name: 'Updated blog',
      description: 'Updated description',
      websiteUrl: 'https://updated.com',
    };

    await updateBlog(app, createdBlog.id, blogUpdateData);

    const blogResponse = await getBlogById(app, createdBlog.id);

    expect(blogResponse).toEqual({
      id: createdBlog.id,
      ...blogUpdateData,
      createdAt: createdBlog.createdAt,
      isMembership: createdBlog.isMembership,
    });
  });

  it('✅ should delete blog and check after "NOT FOUND"; DELETE /api/blogs/:id', async () => {
    const createdBlog = await createBlog(app);

    await request(app)
      .delete(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${BLOGS_PATH}/${createdBlog.id}`)
      .expect(HttpStatus.NotFound);
  });
});
