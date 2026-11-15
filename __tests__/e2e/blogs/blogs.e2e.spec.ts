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

function uniqueNamePrefix(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 6);
}

describe('Blog API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeEach(async () => {
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

    expect(response.body).toMatchObject({
      page: 1,
      pageSize: 10,
      pagesCount: expect.any(Number),
      totalCount: expect.any(Number),
      items: expect.any(Array),
    });
    expect(response.body.items.length).toBeGreaterThanOrEqual(2);
  });

  it('✅ should paginate blogs; GET /api/blogs?pageNumber&pageSize', async () => {
    const term = uniqueNamePrefix();
    const firstName = `${term}a`;
    const secondName = `${term}b`;
    await createBlog(app, { name: secondName });
    await createBlog(app, { name: firstName });

    const query = {
      searchBlogNameTerm: term,
      sortBy: 'name',
      sortDirection: 'asc',
      pageSize: 1,
    };

    const page1 = await request(app)
      .get(BLOGS_PATH)
      .query({ ...query, pageNumber: 1 })
      .expect(HttpStatus.Ok);

    expect(page1.body).toMatchObject({
      page: 1,
      pageSize: 1,
      totalCount: 2,
      pagesCount: 2,
      items: [expect.objectContaining({ name: firstName })],
    });

    const page2 = await request(app)
      .get(BLOGS_PATH)
      .query({ ...query, pageNumber: 2 })
      .expect(HttpStatus.Ok);

    expect(page2.body).toMatchObject({
      page: 2,
      items: [expect.objectContaining({ name: secondName })],
    });
    expect(page1.body.items[0].id).not.toBe(page2.body.items[0].id);
  });

  it('✅ should sort blogs by name; GET /api/blogs?sortBy&sortDirection', async () => {
    const term = uniqueNamePrefix();
    await createBlog(app, { name: `${term}zzz` });
    await createBlog(app, { name: `${term}aaa` });

    const response = await request(app)
      .get(BLOGS_PATH)
      .query({
        searchBlogNameTerm: term,
        sortBy: 'name',
        sortDirection: 'asc',
        pageSize: 10,
      })
      .expect(HttpStatus.Ok);

    const names = response.body.items.map((b: { name: string }) => b.name);
    expect(names).toEqual([`${term}aaa`, `${term}zzz`]);
  });

  it('✅ should search blogs by name; GET /api/blogs?searchBlogNameTerm', async () => {
    const term = uniqueNamePrefix();
    const matchName = `${term}hit`;
    await createBlog(app, { name: matchName });
    await createBlog(app, { name: 'Other blog' });

    const response = await request(app)
      .get(BLOGS_PATH)
      .query({ searchBlogNameTerm: term, pageSize: 50 })
      .expect(HttpStatus.Ok);

    expect(response.body.totalCount).toBe(1);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].name).toBe(matchName);
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

  it('✅ should keep blog when update body is unchanged; PUT /api/blogs/:id', async () => {
    const createdBlog = await createBlog(app);

    await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .send({
        name: createdBlog.name,
        description: createdBlog.description,
        websiteUrl: createdBlog.websiteUrl,
      })
      .expect(HttpStatus.NoContent);

    const blog = await getBlogById(app, createdBlog.id);
    expect(blog).toEqual(createdBlog);
  });

  it('✅ should search blog name literally; GET /api/blogs?searchBlogNameTerm', async () => {
    await createBlog(app, { name: 'a.b' });
    await createBlog(app, { name: 'axb' });

    const literal = await request(app)
      .get(BLOGS_PATH)
      .query({ searchBlogNameTerm: 'a.b' })
      .expect(HttpStatus.Ok);

    expect(literal.body.totalCount).toBe(1);
    expect(literal.body.items[0].name).toBe('a.b');

    const special = await request(app)
      .get(BLOGS_PATH)
      .query({ searchBlogNameTerm: '(' })
      .expect(HttpStatus.Ok);

    expect(special.body.totalCount).toBe(0);
  });

  it('❌ should return 404 when blog does not exist; GET /api/blogs/:id', async () => {
    const response = await request(app)
      .get(`${BLOGS_PATH}/507f1f77bcf86cd799439011`)
      .expect(HttpStatus.NotFound);

    expect(response.body.errorsMessages).toEqual([
      { field: 'id', message: expect.any(String) },
    ]);
  });

  it('❌ should return 404 when deleting missing blog; DELETE /api/blogs/:id', async () => {
    await request(app)
      .delete(`${BLOGS_PATH}/507f1f77bcf86cd799439011`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
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
