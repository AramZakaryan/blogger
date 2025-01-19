import { param } from 'express-validator'

export const userParamsValidator = [
  param('id')
    .notEmpty()
    .withMessage({
      message: 'user id as URI parameter is required',
      field: 'params',
    })
    .isMongoId()
    .withMessage({
      message: 'user id must be in a valid format',
      field: 'params',
    }),
]
