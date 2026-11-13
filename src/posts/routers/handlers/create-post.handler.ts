import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { TPostInputDto } from '../../dto/post.input.dto';
import { blogsService } from '../../../blogs/service/blogs.service';
import { postsService } from '../../service/posts.service';
import { errorsHandler } from '../../../core/exceptions/errors.handler';

export async function createPostHandler(
  req: Request<{}, {}, TPostInputDto>,
  res: Response,
) {
  try {
    const blog = await blogsService.findById(req.body.blogId);
    const createdPost = await postsService.create({
      ...req.body,
      blogId: blog.id,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    });

    res.status(HttpStatus.Created).send(createdPost);
  } catch (error) {
    errorsHandler(error, res);
  }
}
