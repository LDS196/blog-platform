import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { blogsRepository } from '../../repositories/blogs.repository';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import { mapToPostsListOutput } from '../../../posts/routers/mappers/map-list-posts-to-output';

export function getBlogPostsHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const blog = blogsRepository.findById(req.params.id);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  const posts = postsRepository.findByBlogId(req.params.id);
  res.status(HttpStatus.Ok).send(mapToPostsListOutput(posts));
}
