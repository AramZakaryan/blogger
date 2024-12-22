import { FindBlogParams, OutputErrorsType } from '../../types'
import { blogService } from '../../services'

/** findBlogIdValidator has the same logic as findBlogParamsValidator,
 * but it used to validate only blogId as a part of body of
 * postControllers.createPost
 * postControllers.updatePost
 * postControllers.deletePost
 */
export const findBlogIdValidator = async (id: FindBlogParams['id']) => {
  /** object for accumulating errors */
  const errors: OutputErrorsType = {
    errorsMessages: [],
  }

  // Check if blog id as uri parameter exists
  if (id === null || id === undefined) {
    errors.errorsMessages.push({
      message: 'blog id as URI parameter is required',
      field: 'blogId',
    })
  }

  const blog = await blogService.findBlog(id)

  // check if a blog with the provided id (received as a parameter) exists
  if (!blog) {
    errors.errorsMessages.push({
      message: `blog with provided id does not exist`,
      field: 'blogId',
    })
  }

  return errors
}
