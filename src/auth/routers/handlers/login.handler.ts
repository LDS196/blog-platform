import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/exceptions/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { TLoginInputDto } from '../../dto/login.input.dto';
import { authService } from '../../service/auth.service';

export async function loginHandler(
  req: Request<{}, {}, TLoginInputDto>,
  res: Response,
) {
  try {
    await authService.login(req.body);
    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    errorsHandler(error, res);
  }
}
