import { query } from 'express-validator';

export const searchNameTermValidation = query('searchNameTerm')
  .optional()
  .isString()
  .withMessage('Search term must be a string')
  .trim();
