import { Router } from 'express';
import { BLOGS_ROUTES } from '../constants/blogs.paths';
import { getBlogsListHandler } from './handlers/get-blogs-list.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import blogInputDtoValidation from '../validation/blog.input-dto.validition-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';

export const blogsRouter = Router();

blogsRouter
  .get(BLOGS_ROUTES.ROOT, getBlogsListHandler)
  .post(
    BLOGS_ROUTES.ROOT,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  );
