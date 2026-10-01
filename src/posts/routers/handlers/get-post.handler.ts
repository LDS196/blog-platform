import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { postsRepository } from '../../repositories/posts.repository';

export function getPostHandler(req: Request<{ id: string }>, res: Response) {
  const post = postsRepository.findById(req.params.id);

  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
    return;
  }

  res.status(HttpStatus.Ok).send(post);
}
