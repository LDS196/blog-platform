import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { mapToListPaginatedOutput } from '../../../core/mapper/map-to-list-paginated-output.util';
import { HttpStatus } from '../../../core/types/http-statuses';
import { PostQueryInput } from '../../../posts/dto/post-query.input';
import { TPostOutputDto } from '../../../posts/dto/post.output.dto';
import { postsService } from '../../../posts/service/posts.service';
import { blogsService } from '../../service/blogs.service';

export async function getBlogPostsHandler(
  req: Request<{ id: string }, {}, {}, PostQueryInput>,
  res: Response,
) {
  try {
    const queryInput = req.query;
    const blog = await blogsService.findById(req.params.id);
    const { posts, totalCount } = await postsService.findByBlogId(
      blog.id,
      queryInput,
    );
    const postsOutput = mapToListPaginatedOutput<TPostOutputDto>({
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
      items: posts,
    });

    res.status(HttpStatus.Ok).send(postsOutput);
  } catch (error) {
    errorsHandler(error, res);
  }
}
