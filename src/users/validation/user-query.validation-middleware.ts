import { query } from 'express-validator';

export const searchLoginTermValidation = query('searchLoginTerm')
  .optional()
  .isString()
  .withMessage('Search login term must be a string')
  .trim();

export const searchEmailTermValidation = query('searchEmailTerm')
  .optional()
  .isString()
  .withMessage('Search email term must be a string')
  .trim();
