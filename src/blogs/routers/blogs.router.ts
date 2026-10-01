import { Router } from 'express';
import { BLOGS_ROUTES } from '../constants/blogs.paths';
import { getBlogsListHandler } from './handlers/get-blogs-list.handler';
import { getBlogHandler } from './handlers/get-blog.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { getBlogPostsHandler } from './handlers/get-blog-posts.handler';
import { createBlogPostHandler } from './handlers/create-blog-post.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import blogInputDtoValidation from '../validation/blog.input-dto.validition-middleware';
import { postByBlogInputDtoValidation } from '../../posts/validation/post.input-dto.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard.middleware';

export const blogsRouter = Router();

blogsRouter
  .get(BLOGS_ROUTES.ROOT, getBlogsListHandler)
  .get(
    BLOGS_ROUTES.POSTS,
    idValidation,
    inputValidationResultMiddleware,
    getBlogPostsHandler,
  )
  .get(
    BLOGS_ROUTES.BY_ID,
    idValidation,
    inputValidationResultMiddleware,
    getBlogHandler,
  )
  .post(
    BLOGS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  )
  .post(
    BLOGS_ROUTES.POSTS,
    superAdminGuardMiddleware,
    idValidation,
    postByBlogInputDtoValidation,
    inputValidationResultMiddleware,
    createBlogPostHandler,
  )
  .put(
    BLOGS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    updateBlogHandler,
  )
  .delete(
    BLOGS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  );
