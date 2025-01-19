import { param } from 'express-validator'
import { blogQueryRepository } from '../../queryRepositories'

export const blogParamsValidator = [
  param('id')
    .notEmpty()
    .withMessage({
      message: 'blog id as URI parameter is required',
      field: 'params',
    })
    .isMongoId()
    .withMessage({
      message: 'blog id must be in a valid format',
      field: 'params',
    }),
]
