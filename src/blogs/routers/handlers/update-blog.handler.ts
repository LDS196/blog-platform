import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { blogsRepository } from '../../repositories/blogs.repository';
import { BlogInputDto } from '../../dto/blog.input.dto';

export function updateBlogHandler(
  req: Request<{ id: string }, {}, BlogInputDto>,
  res: Response,
) {
  const isUpdated = blogsRepository.update(req.params.id, req.body);

  if (!isUpdated) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
