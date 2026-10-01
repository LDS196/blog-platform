import express, { Express, Request, Response } from 'express';
import { HttpStatus } from './core/types/http-statuses';
import { BLOGS_PATH } from './blogs/constants/blogs.paths';
import { blogsRouter } from './blogs/routers/blogs.router';
import { POSTS_PATH } from './posts/constants/posts.paths';
import { postsRouter } from './posts/routers/posts.router';
import { TESTING_PATH } from './testing/constants/testing.paths';
import { testingRouter } from './testing/routers/testing.router';

export const setupApp = (app: Express) => {
  app.use(express.json());
  // Health-check: простой ответ, что сервер жив.
  app.get('/', (reg: Request, res: Response) => {
    res.status(HttpStatus.Ok).send('Hello world!');
  });

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(TESTING_PATH, testingRouter);
};
