import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { blogsRepository } from '../../repositories/blogs.repository';
import { TBlogInputDto } from '../../dto/blog.input.dto';

export async function updateBlogHandler(
  req: Request<{ id: string }, {}, TBlogInputDto>,
  res: Response,
) {
  try {
    const isUpdated = await blogsRepository.update(req.params.id, req.body);

    if (!isUpdated) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Blog not found' }]),
        );
      return;
    }

    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
