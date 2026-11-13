import { query } from 'express-validator';

export const searchBlogNameTermValidation = query('searchBlogNameTerm')
  .optional()
  .isString()
  .withMessage('Search term must be a string')
  .trim();
