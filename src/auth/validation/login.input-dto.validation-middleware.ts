import { body } from 'express-validator';

const loginOrEmailValidation = body('loginOrEmail')
  .exists()
  .withMessage('loginOrEmail is required')
  .isString()
  .withMessage('loginOrEmail must be a string');

const passwordValidation = body('password')
  .exists()
  .withMessage('password is required')
  .isString()
  .withMessage('password must be a string');

const loginInputDtoValidation = [loginOrEmailValidation, passwordValidation];

export default loginInputDtoValidation;
