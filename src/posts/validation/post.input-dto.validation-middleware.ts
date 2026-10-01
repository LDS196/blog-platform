import { body } from 'express-validator';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';

const titleValidation = body('title')
  .isString()
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage('Title must be between 1 and 30 characters');

const shortDescriptionValidation = body('shortDescription')
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Short description must be between 1 and 100 characters');

const contentValidation = body('content')
  .isString()
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage('Content must be between 1 and 1000 characters');

const blogIdValidation = body('blogId')
  .isString()
  .trim()
  .withMessage('Blog ID must be a string')
  .custom((blogId: string) => {
    if (!blogsRepository.findById(blogId)) {
      throw new Error('Blog not found');
    }
    return true;
  });

export const postByBlogInputDtoValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
];

const postInputDtoValidation = [
  ...postByBlogInputDtoValidation,
  blogIdValidation,
];

export default postInputDtoValidation;
