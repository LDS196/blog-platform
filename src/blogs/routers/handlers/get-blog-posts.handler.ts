import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { blogsRepository } from '../../repositories/blogs.repository';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import { mapToPostsListOutput } from '../../../posts/routers/mappers/map-list-posts-to-output';

export async function getBlogPostsHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const blog = await blogsRepository.findById(req.params.id);

    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Blog not found' }]),
        );
      return;
    }

    const posts = await postsRepository.findByBlogId(req.params.id);
    res.status(HttpStatus.Ok).send(mapToPostsListOutput(posts));
  } catch (error) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
