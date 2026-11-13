import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../service/posts.service';
import { mapToListPaginatedOutput } from '../../../core/mapper/map-to-list-paginated-output.util';
import { PostQueryInput } from '../../dto/post-query.input';
import { TPostOutputDto } from '../../dto/post.output.dto';
import { errorsHandler } from '../../../core/exceptions/errors.handler';

export async function getPostsListHandler(
  req: Request<{}, {}, {}, PostQueryInput>,
  res: Response,
) {
  try {
    const queryInput = req.query;
    const { posts, totalCount } = await postsService.findMany(queryInput);
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
