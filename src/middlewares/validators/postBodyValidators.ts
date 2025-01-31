import { handleIsStringIsLengthMax, handleNotEmpty } from './handlers'
import { body } from 'express-validator'
import { blogQueryRepository } from '../../queryRepositories'

export const postBodyValidatorWithoutBodyId = [
  handleNotEmpty('title'),
  handleIsStringIsLengthMax('title', 30),
  handleNotEmpty('shortDescription'),
  handleIsStringIsLengthMax('shortDescription', 100),
  handleNotEmpty('content'),
  handleIsStringIsLengthMax('content', 1000),
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
    })
    // .custom(async (value, { req }) => {
    //   const blog = await blogQueryRepository.findBlog(req.body.blogId)
    //   if (!blog) {
    //     throw new Error(
    //       JSON.stringify({
    //         message: `blog with provided id does not exist`,
    //         field: 'blogId',
    //       }),
    //     )
    //   }
    //   return true
    // }),
]
