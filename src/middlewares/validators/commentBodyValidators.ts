import { handleIsStringIsLengthMinMax, handleNotEmpty } from './handlers'
import { body } from 'express-validator'
import { postQueryRepository } from '../../queryRepositories'

export const commentBodyValidatorWithoutPostId = [
  handleNotEmpty('content'),
  handleIsStringIsLengthMinMax('content', 20, 300),
]

export const commentBodyValidator = [
  ...commentBodyValidatorWithoutPostId,
  body('postId')
    .notEmpty()
    .withMessage({
      message: 'postId is required',
      field: 'postId',
    })
    .isMongoId()
    .withMessage({
      message: 'postId must be in a valid format',
      field: 'postId',
    })
    .custom(async (value, { req }) => {
      const post = await postQueryRepository.findPost(req.body.postId)
      if (!post) {
        throw new Error(
          JSON.stringify({
            message: 'post with provided id does not exist',
            field: 'postId',
          }),
        )
      }
      return true
    }),
]
