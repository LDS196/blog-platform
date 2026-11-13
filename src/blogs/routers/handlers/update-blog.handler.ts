import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { TBlogInputDto } from '../../dto/blog.input.dto';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { blogsService } from '../../service/blogs.service';

export async function updateBlogHandler(
  req: Request<{ id: string }, {}, TBlogInputDto>,
  res: Response,
) {
  try {
    await blogsService.update(req.params.id, req.body);
    res.status(HttpStatus.NoContent).send();
  } catch (error) {
    errorsHandler(error, res);
  }
}
