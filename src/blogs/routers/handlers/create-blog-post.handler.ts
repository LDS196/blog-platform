import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { TPostByBlogInputDto } from '../../../posts/dto/post.input.dto';
import { postsService } from '../../../posts/service/posts.service';
import { blogsService } from '../../service/blogs.service';

export async function createBlogPostHandler(
  req: Request<{ id: string }, {}, TPostByBlogInputDto>,
  res: Response,
) {
  try {
    const blog = await blogsService.findById(req.params.id);
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
