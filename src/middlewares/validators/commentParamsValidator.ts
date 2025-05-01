import { param } from 'express-validator'

export const commentParamsValidator = [
  param('id')
    .notEmpty()
    .withMessage({
      message: 'comment id as URI parameter is required',
      field: 'params',
    })
    .isMongoId()
    .withMessage({
      message: 'comment id must be in a valid format',
      field: 'params',
    }),
]