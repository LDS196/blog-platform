import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { TPostInputDto } from '../../dto/post.input.dto';
import { postsService } from '../../service/posts.service';

export async function updatePostHandler(
  req: Request<{ id: string }, {}, TPostInputDto>,
  res: Response,
) {
  try {
    await postsService.update(req.params.id, req.body);
    res.status(HttpStatus.NoContent).send();
  } catch (error) {
    errorsHandler(error, res);
  }
}
