import { param } from 'express-validator'
import { postQueryRepository } from '../../queryRepositories'

export const postParamsValidator = [
  param('id')
    .notEmpty()
    .withMessage({
      message: 'post id as URI parameter is required',
      field: 'params',
    })
    .isMongoId()
    .withMessage({
      message: 'post id must be in a valid format',
      field: 'params',
    }),
]