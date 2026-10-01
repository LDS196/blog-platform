import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { blogsRepository } from '../../repositories/blogs.repository';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import { PostByBlogInputDto } from '../../../posts/dto/post.input.dto';

export function createBlogPostHandler(
  req: Request<{ id: string }, {}, PostByBlogInputDto>,
  res: Response,
) {
  const blog = blogsRepository.findById(req.params.id);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  const createdPost = postsRepository.create({
    ...req.body,
    blogId: blog.id,
  });

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
