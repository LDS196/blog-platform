import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsService } from '../../service/blogs.service';
import { BlogQueryInput } from '../../dto/blog-query.input';
import { mapToListPaginatedOutput } from '../../../core/mapper/map-to-list-paginated-output.util';
import { errorsHandler } from '../../../core/exceptions/errors.handler';

export async function getBlogsListHandler(
  req: Request<{}, {}, {}, BlogQueryInput>,
  res: Response,
) {
  try {
    const queryInput = req.query;
    const { blogs, totalCount } = await blogsService.findMany(queryInput);
    const pageNumber = queryInput.pageNumber;
    const pageSize = queryInput.pageSize;
    const blogsOutput = mapToListPaginatedOutput({
      items: blogs,
      pageNumber,
      pageSize,
      totalCount,
    });

    res.status(HttpStatus.Ok).send(blogsOutput);
  } catch (error) {
    errorsHandler(error, res);
  }
}
