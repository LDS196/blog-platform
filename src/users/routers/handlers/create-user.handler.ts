import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { TUserInputDto } from '../../dto/user.input.dto';
import { usersService } from '../../service/users.service';

export async function createUserHandler(
  req: Request<{}, {}, TUserInputDto>,
  res: Response,
) {
  try {
    const createdUser = await usersService.create(req.body);
    res.status(HttpStatus.Created).send(createdUser);
  } catch (error) {
    errorsHandler(error, res);
  }
}
