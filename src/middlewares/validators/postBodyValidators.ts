import { handleIsStringIsLengthMax, handleNotEmpty } from './handlers'
import { body } from 'express-validator'


export const postBodyValidatorWithoutBodyId = [
  handleNotEmpty('title'),
  handleIsStringIsLengthMax('title', 30),
  handleNotEmpty('shortDescription'),
  handleIsStringIsLengthMax('shortDescription', 100),
  handleNotEmpty('content'),
  handleIsStringIsLengthMax('content', 1000)
]



export const postBodyValidator = [
    ...postBodyValidatorWithoutBodyId,
  body('blogId')
    .notEmpty()
    .withMessage({
      message: 'blogId is required',
      field: 'blogId',
    })
    .isMongoId()
    .withMessage({
      message: 'blogId must be in a valid format',
      field: 'blogId',
    }),
]


