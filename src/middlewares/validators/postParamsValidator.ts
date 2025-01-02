import { param } from 'express-validator'
import { postQueryRepository } from '../../queryRepositories'

export const postParamsValidator = [
  param('id')
    .notEmpty()
    .withMessage({
      message: 'post id as URI parameter is required',
      field: 'params',
    })
    .bail()
    .custom(async (_, { req }) => {
      const id = req.params?.id
      const post = await postQueryRepository.findPost(id)
      if (!post) {
        throw new Error(
          JSON.stringify({
            message: `post with provided id does not exist`,
            field: 'params',
          }),
        )
      }
      return true
    }),
]
