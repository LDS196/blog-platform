import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { blogsRepository } from '../../repositories/blogs.repository';
import { postsRepository } from '../../../posts/repositories/posts.repository';

export function deleteBlogHandler(req: Request<{ id: string }>, res: Response) {
  const isDeleted = blogsRepository.delete(req.params.id);

  if (!isDeleted) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  postsRepository.deleteByBlogId(req.params.id);
  res.sendStatus(HttpStatus.NoContent);
}
