import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { postsRepository } from '../../repositories/posts.repository';
import { mapToPostOutput } from '../mappers/map-list-posts-to-output';

export async function getPostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const post = await postsRepository.findById(req.params.id);

  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
    return;
  }

  res.status(HttpStatus.Ok).send(mapToPostOutput(post));
}
