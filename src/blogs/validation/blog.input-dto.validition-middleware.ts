import { body } from 'express-validator';
import { URL_REGEX } from '../../core/regex';

const websiteUrlValidation = body('websiteUrl')
  .isLength({ min: 1, max: 100 })
  .withMessage('Website URL must be between 1 and 100 characters')
  .matches(URL_REGEX)
  .withMessage('Invalid website URL');

const nameValidation = body('name')
  .isString()
  .isLength({ min: 1, max: 15 })
  .withMessage('Name must be between 1 and 15 characters');

const descriptionValidation = body('description')
  .isString()
  .isLength({ min: 1, max: 500 })
  .withMessage('Description must be between 1 and 500 characters');

const blogInputDtoValidation = [
  websiteUrlValidation,
  nameValidation,
  descriptionValidation,
];

export default blogInputDtoValidation;
