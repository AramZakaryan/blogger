import { param } from 'express-validator'

import { blogQueryRepository } from '../../queryRepositories'
import { toObjectId } from '../../common/helpers/toObjectId'

export const blogParamsValidator = [
  param('id')
    .notEmpty()
    .withMessage({
      message: 'blog id as URI parameter is required',
      field: 'params',
    })
    .custom(async (_, { req }) => {
      const id = req.params?.id
      const blog = await blogQueryRepository.findBlog(id)
      if (!blog) {
        throw new Error(
          JSON.stringify({
            message: `blog with provided id does not exist`,
            field: 'params',
          }),
        )
      }
      return true
    }),
]
