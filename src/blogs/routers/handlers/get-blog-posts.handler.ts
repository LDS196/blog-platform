import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../../posts/service/posts.service';
import { blogsService } from '../../service/blogs.service';

export async function getBlogPostsHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const blog = await blogsService.findById(req.params.id);

    const posts = await postsService.findByBlogId(blog.id);
    res.status(HttpStatus.Ok).send(posts);
  } catch (error) {
    errorsHandler(error, res);
  }
}
