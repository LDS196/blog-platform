import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { postsRepository } from '../../repositories/posts.repository';
import { TPostInputDto } from '../../dto/post.input.dto';

export async function updatePostHandler(
  req: Request<{ id: string }, {}, TPostInputDto>,
  res: Response,
) {
  const isUpdated = await postsRepository.update(req.params.id, req.body);

  if (!isUpdated) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
