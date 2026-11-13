import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsService } from '../../service/blogs.service';

export async function getBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const blog = await blogsService.findById(req.params.id);

    res.status(HttpStatus.Ok).send(blog);
  } catch (error) {
    errorsHandler(error, res);
  }
}
