import { CreatePostBody, OutputErrorsType } from '../../types'

export const createPostRequestValidator = (body: CreatePostBody) => {
  /** object for accumulating errors */
  const errors: OutputErrorsType = {
    errorsMessages: [],
  }

  // Check if body is an object
  if (Object.getPrototypeOf(body) !== Object.prototype || body === null) {
    errors.errorsMessages.push({
      message: 'body must be an object',
      field: 'body',
    })
    return errors
  }

  const keys = Object.keys(body)

  // Check if body has at least one key
  if (keys.length === 0) {
    errors.errorsMessages.push({
      message: 'at least one field is required',
      field: 'body',
    })
    return errors
  }

  const allowedKeys = ['title', 'shortDescription', 'content', 'blogId']

  // Check for unexpected keys in the body
  Object.keys(body).forEach((key) => {
    if (!allowedKeys.includes(key)) {
      errors.errorsMessages.push({
        message: `unexpected key '${key}' found`,
        field: key,
      })
    }
  })

  if (!body.title) {
    errors.errorsMessages.push({
      message: 'title is required',
      field: 'title',
    })
  } else if (body.title.length > 30) {
    errors.errorsMessages.push({
      message: 'title max length is 30',
      field: 'title',
    })
  }

  if (!body.shortDescription) {
    errors.errorsMessages.push({
      message: 'shortDescription is required',
      field: 'shortDescription',
    })
  } else if (body.shortDescription.length > 100) {
    errors.errorsMessages.push({
      message: 'shortDescription max length is 100',
      field: 'description',
    })
  }

  if (!body.content) {
    errors.errorsMessages.push({
      message: 'content is required',
      field: 'content',
    })
  } else if (body.content.length > 1000) {
    errors.errorsMessages.push({
      message: 'content max length is 1000',
      field: 'content',
    })
  }

  if (!body.blogId) {
    errors.errorsMessages.push({
      message: 'blogId is required',
      field: 'blogId',
    })
  }

  return errors
}
