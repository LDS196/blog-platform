import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../service/posts.service';

export async function getPostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const post = await postsService.findById(req.params.id);
    res.status(HttpStatus.Ok).send(post);
  } catch (error) {
    errorsHandler(error, res);
  }
}
