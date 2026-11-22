import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { POSTS_PATH } from '../../../src/posts/constants/posts.paths';
import { clearDb } from '../../utils/clear-db';
import { createBlog } from '../../utils/blogs/create-blog';
import { createPost } from '../../utils/posts/create-post';

describe('GET /api/posts pagination, same case as Homework 4 checker', () => {
  const app = express();
  setupApp(app);

  beforeEach(async () => {
    await clearDb(app);
  });

  it('returns pages of 12 posts: default, page size, createdAt asc, blogName asc', async () => {
    const titlesOldestFirst: string[] = [];

    for (let index = 1; index <= 12; index += 1) {
      const label = String(index).padStart(2, '0');
      const blog = await createBlog(app, { name: `Blog ${label}` });
      const post = await createPost(app, blog.id, { title: `Post ${label}` });
      titlesOldestFirst.push(post.title);
      await new Promise((resolve) => setTimeout(resolve, 5));
    }

    const newestFirst = [...titlesOldestFirst].reverse();

    const defaultPage = await request(app)
      .get(POSTS_PATH)
      .expect(HttpStatus.Ok);
    expectPage(defaultPage.body, {
      page: 1,
      pageSize: 10,
      totalCount: 12,
      titles: newestFirst.slice(0, 10),
    });

    const firstPageOfThree = await request(app)
      .get(POSTS_PATH)
      .query({ pageSize: 3, pageNumber: 1 })
      .expect(HttpStatus.Ok);
    expectPage(firstPageOfThree.body, {
      page: 1,
      pageSize: 3,
      totalCount: 12,
      titles: newestFirst.slice(0, 3),
    });

    const thirdPageOfThree = await request(app)
      .get(POSTS_PATH)
      .query({ pageSize: 3, pageNumber: 3 })
      .expect(HttpStatus.Ok);
    expectPage(thirdPageOfThree.body, {
      page: 3,
      pageSize: 3,
      totalCount: 12,
      titles: newestFirst.slice(6, 9),
    });

    const thirdPageOfFive = await request(app)
      .get(POSTS_PATH)
      .query({ pageSize: 5, pageNumber: 3 })
      .expect(HttpStatus.Ok);
    expectPage(thirdPageOfFive.body, {
      page: 3,
      pageSize: 5,
      totalCount: 12,
      titles: newestFirst.slice(10, 12),
    });

    const oldestFirstPage = await request(app)
      .get(POSTS_PATH)
      .query({ sortDirection: 'asc' })
      .expect(HttpStatus.Ok);
    expectPage(oldestFirstPage.body, {
      page: 1,
      pageSize: 10,
      totalCount: 12,
      titles: titlesOldestFirst.slice(0, 10),
    });

    const byBlogName = await request(app)
      .get(POSTS_PATH)
      .query({
        pageSize: 9,
        pageNumber: 1,
        sortBy: 'blogName',
        sortDirection: 'asc',
      })
      .expect(HttpStatus.Ok);
    expectPage(byBlogName.body, {
      page: 1,
      pageSize: 9,
      totalCount: 12,
      titles: titlesOldestFirst.slice(0, 9),
    });
  }, 60_000);
});

function expectPage(
  body: {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: { title: string }[];
  },
  expected: {
    page: number;
    pageSize: number;
    totalCount: number;
    titles: string[];
  },
) {
  expect(body).toMatchObject({
    pagesCount: Math.ceil(expected.totalCount / expected.pageSize),
    page: expected.page,
    pageSize: expected.pageSize,
    totalCount: expected.totalCount,
  });
  expect(body.items.map((post) => post.title)).toEqual(expected.titles);
}
