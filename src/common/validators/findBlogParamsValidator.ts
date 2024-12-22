import { OutputErrorsType, UpdateBlogParams } from '../../types'
import { blogService } from '../../services'

export const findBlogParamsValidator = async (params: UpdateBlogParams) => {
  /** object for accumulating errors */
  const errors: OutputErrorsType = {
    errorsMessages: [],
  }

  // Check if blog id as uri parameter exists
  if (
    Object.getPrototypeOf(params) !== Object.prototype ||
    params === null ||
    params.id === null ||
    params.id === undefined
  ) {
    errors.errorsMessages.push({
      message: 'blog id as URI parameter is required',
      field: 'params',
    })
  }

  const blog = await blogService.findBlog(params.id)

  // check if a blog with the provided id (received as a parameter) exists
  if (!blog) {
    errors.errorsMessages.push({
      message: `blog with provided id does not exist`,
      field: 'params',
    })
  }

  return errors
}
