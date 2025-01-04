import { body } from 'express-validator'
import { handleNotEmpty } from './handlers/handleNotEmpty'
import { handleIsStringIsLengthMax } from './handlers/handleIsStringIsLengthMax'
import { handleIsString } from './handlers/handleIsString'
import { blogQueryRepository } from '../../queryRepositories'
import { ObjectId } from 'mongodb'
import { toObjectId } from '../../common/helpers/toObjectId'


export const createPostBodyByBlogValidator = [
  handleNotEmpty('title'),
  handleIsStringIsLengthMax('title', 30),
  handleNotEmpty('shortDescription'),
  handleIsStringIsLengthMax('shortDescription', 100),
  handleNotEmpty('content'),
  handleIsStringIsLengthMax('content', 1000),
]

export const createPostBodyValidator = [
  ...createPostBodyByBlogValidator,
  handleNotEmpty('blogId', false),
  handleIsString('blogId').custom(async (value, { req }) => {
    const blog = await blogQueryRepository.findBlog(req.body.blogId)
    if (!blog) {
      throw new Error(
        JSON.stringify({
          message: `blog with provided id does not exist`,
          field: 'blogId',
        }),
      )
    }
    return true
  }),
]

export const updatePostBodyValidator = createPostBodyValidator
