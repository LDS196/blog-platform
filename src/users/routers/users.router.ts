import { RequestHandler, Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation.middleware';
import { sanitizeQueryParams } from '../../core/middlewares/validation/sanitize-query.middleware';
import { USERS_ROUTES } from '../constants/users.paths';
import { UserSortField } from '../dto/user-sort-field';
import userInputDtoValidation from '../validation/user.input-dto.validation-middleware';
import {
  searchEmailTermValidation,
  searchLoginTermValidation,
} from '../validation/user-query.validation-middleware';
import { createUserHandler } from './handlers/create-user.handler';
import { deleteUserHandler } from './handlers/delete-user.handler';
import { getUsersListHandler } from './handlers/get-users-list.handler';

export const usersRouter = Router();

usersRouter
  .get(
    USERS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    paginationAndSortingValidation(UserSortField),
    searchLoginTermValidation,
    searchEmailTermValidation,
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    getUsersListHandler as unknown as RequestHandler,
  )
  .post(
    USERS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    createUserHandler,
  )
  .delete(
    USERS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteUserHandler,
  );
