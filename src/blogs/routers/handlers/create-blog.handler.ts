import { Request, Response } from 'express';

import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { TBlogInputDto } from '../../dto/blog.input.dto';
import { mapToBlogOutput } from '../mappers/map-list-blogs-to-output';

export async function createBlogHandler(
  req: Request<{}, {}, TBlogInputDto>,
  res: Response,
) {
  const newBlog = {
    ...req.body,
    createdAt: new Date().toISOString(),
    isMembership: false,
  };
  try {
    const createdBlog = await blogsRepository.create(newBlog);
    res.status(HttpStatus.Created).send(mapToBlogOutput(createdBlog));
  } catch (error) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
