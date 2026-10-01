import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { BlogInputDto } from '../../../src/blogs/dto/blog.input.dto';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs.paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { clearDb } from '../../utils/clear-db';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';

describe('Blog API body validation check', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();
  const correctDto: BlogInputDto = getBlogDto();

  beforeAll(async () => {
    await clearDb(app);
  });

  it('❌ should return 401 without auth; POST /api/blogs', async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(correctDto)
      .expect(HttpStatus.Unauthorized);
  });

  it(`❌ should not create blog when incorrect body passed; POST /api/blogs`, async () => {
    const invalidDataSet1 = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctDto,
        name: '',
        description: '',
        websiteUrl: 'invalid url',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(3);

    const invalidDataSet2 = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctDto,
        name: 'this name is way too long',
        description: '',
        websiteUrl: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(3);

    const invalidDataSet3 = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({ ...correctDto, name: '1234567890123456' })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const blogListResponse = await request(app).get(BLOGS_PATH);
    expect(blogListResponse.body).toHaveLength(0);
  });

  it('❌ should not update blog when incorrect data passed; PUT /api/blogs/:id', async () => {
    const createdBlog = await createBlog(app, correctDto);
    const createdId = createdBlog.id;

    const invalidDataSet1 = await request(app)
      .put(`${BLOGS_PATH}/${createdId}`)
      .set('Authorization', adminToken)
      .send({
        ...correctDto,
        name: '',
        description: '',
        websiteUrl: 'invalid url',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(3);

    const invalidDataSet2 = await request(app)
      .put(`${BLOGS_PATH}/${createdId}`)
      .set('Authorization', adminToken)
      .send({ ...correctDto, name: '1234567890123456' })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(1);

    const blogResponse = await getBlogById(app, createdId);
    expect(blogResponse).toEqual(createdBlog);
  });
});
