import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { TPostInputDto } from '../../dto/post.input.dto';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';
import { mapToPostOutput } from '../mappers/map-list-posts-to-output';

export async function createPostHandler(
  req: Request<{}, {}, TPostInputDto>,
  res: Response,
) {
  try {
    const blog = await blogsRepository.findById(req.body.blogId);
    if (!blog) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([{ field: 'blogId', message: 'Blog not found' }]),
        );
      return;
    }
    const newPost = {
      ...req.body,
      createdAt: new Date().toISOString(),
      blogName: blog.name,
    };
    const createdPost = await postsRepository.create(newPost);

    if (!createdPost) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([{ field: 'blogId', message: 'Blog not found' }]),
        );
      return;
    }

    res.status(HttpStatus.Created).send(mapToPostOutput(createdPost));
  } catch (error) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
