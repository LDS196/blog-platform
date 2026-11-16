import { body } from 'express-validator';

const LOGIN_PATTERN = /^[a-zA-Z0-9_-]*$/;
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const loginValidation = body('login')
  .isString()
  .withMessage('Login must be a string')
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage('Login must be between 3 and 10 characters')
  .matches(LOGIN_PATTERN)
  .withMessage('Login must match ^[a-zA-Z0-9_-]*$');

const passwordValidation = body('password')
  .isString()
  .withMessage('Password must be a string')
  .isLength({ min: 6, max: 20 })
  .withMessage('Password must be between 6 and 20 characters');

const emailValidation = body('email')
  .isString()
  .withMessage('Email must be a string')
  .trim()
  .matches(EMAIL_PATTERN)
  .withMessage('Invalid email');

const userInputDtoValidation = [
  loginValidation,
  passwordValidation,
  emailValidation,
];

export default userInputDtoValidation;
