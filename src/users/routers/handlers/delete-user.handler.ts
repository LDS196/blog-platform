import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { usersService } from '../../service/users.service';

export async function deleteUserHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    await usersService.delete(req.params.id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    errorsHandler(error, res);
  }
}
