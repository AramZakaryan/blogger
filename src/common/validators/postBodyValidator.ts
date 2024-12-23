import { body } from 'express-validator'
import { blogService } from '../../services'

export const postBodyValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage({ message: 'title is required', field: 'title' })
    .bail()
    .isString()
    .withMessage({ message: 'title must be a string', field: 'title' })
    .bail()
    .isLength({ max: 30 })
    .withMessage({ message: 'title max length is 30', field: 'title' }),
  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage({ message: 'shortDescription is required', field: 'shortDescription' })
    .bail()
    .isString()
    .withMessage({ message: 'shortDescription must be a string', field: 'shortDescription' })
    .bail()
    .isLength({ max: 100 })
    .withMessage({ message: 'shortDescription max length is 100', field: 'shortDescription' }),
  body('content')
    .trim()
    .notEmpty()
    .withMessage({ message: 'content is required', field: 'content' })
    .bail()
    .isString()
    .withMessage({ message: 'content must be a string', field: 'content' })
    .bail()
    .isLength({ max: 1000 })
    .withMessage({ message: 'content max length is 1000', field: 'content' }),
  body('blogId')
    .notEmpty()
    .withMessage({ message: 'blogId is required', field: 'blogId' })
    .bail()
    .isString()
    .withMessage({ message: 'blogId must be a string', field: 'blogId' })
    .custom(async (value, { req }) => {
      const blog = await blogService.findBlog(req.body.blogId)
      if (!blog) {
        throw new Error(
          JSON.stringify({
            message: `blog with provided id does not exist`,
            field: 'blogId',
          }),
        )
      }
      return true
    }),
]
