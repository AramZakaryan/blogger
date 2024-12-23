import { param } from 'express-validator'
import { postService } from '../../services'

export const postParamsValidator = [
  param('id')
    .notEmpty()
    .withMessage({
      message: 'post id as URI parameter is required',
      field: 'params',
    })
    .bail()
    .custom(async (value, { req }) => {
      const post = await postService.findPost(req.params?.id)
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
