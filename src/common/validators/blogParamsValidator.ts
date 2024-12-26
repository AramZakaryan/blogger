import { param } from 'express-validator'
import { blogRepository } from '../../repositories'

export const blogParamsValidator = [
  param('id')
    .notEmpty()
    .withMessage({
      message: 'blog id as URI parameter is required',
      field: 'params',
    })
    .bail()
    .custom(async (_, { req }) => {
      const blog = await blogRepository.findBlog(req.params?.id)
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
