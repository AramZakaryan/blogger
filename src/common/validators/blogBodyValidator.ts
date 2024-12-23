import { body } from 'express-validator'

export const blogBodyValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage({ message: 'name is required', field: 'name' })
    .bail()
    .isString()
    .withMessage({ message: 'name must be a string', field: 'name' })
    .bail()
    .isLength({ max: 15 })
    .withMessage({ message: 'name max length is 15', field: 'name' }),
  body('description')
    .trim()
    .notEmpty()
    .withMessage({ message: 'description is required', field: 'description' })
    .bail()
    .isString()
    .withMessage({ message: 'description must be a string', field: 'description' })
    .bail()
    .isLength({ max: 500 })
    .withMessage({ message: 'description max length is 500', field: 'description' }),
  body('websiteUrl')
    .notEmpty()
    .withMessage({ message: 'websiteUrl is required', field: 'websiteUrl' })
    .bail()
    .isString()
    .withMessage({ message: 'websiteUrl must be a string', field: 'websiteUrl' })
    .bail()
    .isLength({ max: 100 })
    .withMessage({ message: 'websiteUrl max length is 100', field: 'websiteUrl' })
    .bail()
    .isURL()
    .withMessage({ message: 'websiteUrl incorrect format', field: 'websiteUrl' }),
]
