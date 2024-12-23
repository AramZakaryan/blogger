import { body } from 'express-validator'

export const createPostBodyValidator = [
  body('title')
    .isString()
    .withMessage({ message: 'title must be a string', field: 'title' })
    .trim()
    .notEmpty()
    .withMessage({ message: 'title is required', field: 'title'})
    .isLength({ max: 30 })
    .withMessage({ message: 'title max length is 30', field: 'title'}),
  body('shortDescription')
    .isString()
    .withMessage({ message: 'shortDescription must be a string', field: 'shortDescription' })
    .trim()
    .notEmpty()
    .withMessage({ message: 'shortDescription is required', field: 'shortDescription' })
    .isLength({ max: 100 })
    .withMessage({ message: 'shortDescription max length is 100', field: 'shortDescription' }),
  body('content')
    .isString()
    .withMessage({ message: 'content must be a string', field: 'content'})
    .trim()
    .notEmpty()
    .withMessage({ message: 'content is required', field: 'content'})
    .isLength({ max: 1000 })
    .withMessage({ message: 'content max length is 1000', field: 'content'}),
  body('blogId')
    .isString()
    .withMessage({ message: 'blogId must be a string', field: 'blogId'})
    .notEmpty()
    .withMessage({ message: 'blogId is required', field: 'blogId'}),
]
