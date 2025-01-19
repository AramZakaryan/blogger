import { handleIsString, handleIsStringIsLengthMax, handleNotEmpty } from './handlers'
import { blogQueryRepository } from '../../queryRepositories'

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
