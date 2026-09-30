import { Request, Response } from 'express';

import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { BlogInputDto } from '../../dto/blog.input.dto';

export function createBlogHandler(
  req: Request<{}, {}, BlogInputDto>,
  res: Response,
) {
  const createdBlog = blogsRepository.create(req.body);
  res.status(HttpStatus.Created).send(createdBlog);
}
