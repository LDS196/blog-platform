import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../service/posts.service';
import { errorsHandler } from '../../../core/exceptions/errors.handler';

export async function deletePostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    await postsService.delete(req.params.id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    errorsHandler(error, res);
  }
}
