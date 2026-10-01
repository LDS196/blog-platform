import { body } from 'express-validator';
import { URL_REGEX } from '../../core/regex';

const nameValidation = body('name')
  .isString()
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage('Name must be between 1 and 15 characters');

const websiteUrlValidation = body('websiteUrl')
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Website URL must be between 1 and 100 characters')
  .matches(URL_REGEX)
  .withMessage('Invalid website URL');

const descriptionValidation = body('description')
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage('Description must be between 1 and 500 characters');

const blogInputDtoValidation = [
  nameValidation,
  websiteUrlValidation,
  descriptionValidation,
];

export default blogInputDtoValidation;
