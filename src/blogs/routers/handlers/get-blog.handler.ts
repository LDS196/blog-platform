import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { blogsRepository } from '../../repositories/blogs.repository';
import { mapToBlogOutput } from '../mappers/map-list-blogs-to-output';

export async function getBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const blog = await blogsRepository.findById(req.params.id);

    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Blog not found' }]),
        );
      return;
    }

    res.status(HttpStatus.Ok).send(mapToBlogOutput(blog));
  } catch (error) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
