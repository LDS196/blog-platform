import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { blogsRepository } from '../../repositories/blogs.repository';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import { TPostByBlogInputDto } from '../../../posts/dto/post.input.dto';
import { mapToPostOutput } from '../../../posts/routers/mappers/map-list-posts-to-output';

export async function createBlogPostHandler(
  req: Request<{ id: string }, {}, TPostByBlogInputDto>,
  res: Response,
) {
  const blog = await blogsRepository.findById(req.params.id);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  const createdPost = await postsRepository.create({
    ...req.body,
    blogId: blog._id.toString(),
    blogName: blog.name,
    createdAt: new Date().toISOString(),
  });

  if (!createdPost) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([{ field: 'blogId', message: 'Blog not found' }]),
      );
    return;
  }

  res.status(HttpStatus.Created).send(mapToPostOutput(createdPost));
}
