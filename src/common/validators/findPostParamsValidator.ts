import { FindPostParams, OutputErrorsType, UpdateBlogParams } from '../../types'
import { blogService, postService } from '../../services'

export const findPostParamsValidator = async (params: FindPostParams) => {
  /** object for accumulating errors */
  const errors: OutputErrorsType = {
    errorsMessages: [],
  }

  // Check if post id as uri parameter exists
  if (
    Object.getPrototypeOf(params) !== Object.prototype ||
    params === null ||
    params.id === null ||
    params.id === undefined
  ) {
    errors.errorsMessages.push({
      message: 'post id as URI parameter is required',
      field: 'params',
    })
  }

  const post = await postService.findPost(params.id)

  // check if a post with the provided id (received as a parameter) exists
  if (!post) {
    errors.errorsMessages.push({
      message: `post with provided id does not exist`,
      field: 'params',
    })
  }

  return errors
}
