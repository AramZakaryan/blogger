import { PostDto, OutputErrorsType } from '../../types'

// title: string // maxLength: 30
// shortDescription: string // maxLength: 100
// content: string // maxLength: 1000
// blogId: string
// blogName: string

export const postRequestValidator = (body: PostDto) => {
  /** object for accumulating errors */
  const errors: OutputErrorsType = {
    errorsMessages: [],
  }

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
