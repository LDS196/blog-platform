import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { PostInputDto } from '../../dto/post.input.dto';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';

export function createPostHandler(
  req: Request<{}, {}, PostInputDto>,
  res: Response,
) {
  const createdPost = postsRepository.create(req.body);

  if (!createdPost) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([{ field: 'blogId', message: 'Blog not found' }]),
      );
    return;
  }

  res.status(HttpStatus.Created).send(createdPost);
}
