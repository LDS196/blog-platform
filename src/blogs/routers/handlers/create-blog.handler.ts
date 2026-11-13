import { Request, Response } from 'express';

import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsService } from '../../service/blogs.service';
import { TBlogInputDto } from '../../dto/blog.input.dto';

export async function createBlogHandler(
  req: Request<{}, {}, TBlogInputDto>,
  res: Response,
) {
  try {
    const createdBlog = await blogsService.create(req.body);
    res.status(HttpStatus.Created).send(createdBlog);
  } catch (error) {
    errorsHandler(error, res);
  }
}
