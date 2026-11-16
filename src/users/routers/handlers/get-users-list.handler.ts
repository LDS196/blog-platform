import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { mapToListPaginatedOutput } from '../../../core/mapper/map-to-list-paginated-output.util';
import { HttpStatus } from '../../../core/types/http-statuses';
import { UserQueryInput } from '../../dto/user-query.input';
import { usersService } from '../../service/users.service';

export async function getUsersListHandler(
  req: Request<{}, {}, {}, UserQueryInput>,
  res: Response,
) {
  try {
    const queryInput = req.query;
    const { users, totalCount } = await usersService.findMany(queryInput);
    const usersOutput = mapToListPaginatedOutput({
      items: users,
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.status(HttpStatus.Ok).send(usersOutput);
  } catch (error) {
    errorsHandler(error, res);
  }
}
