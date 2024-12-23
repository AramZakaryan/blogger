import { CreatePostBody, OutputErrorsType, UpdatePostBody, UpdatePostParams } from '../../types'

export const old_updatePostBodyValidator = (body: UpdatePostBody) => {
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

  // const keys = Object.keys(body)
  //
  // // Check if body has at least one key
  // if (keys.length === 0) {
  //   errors.errorsMessages.push({
  //     message: 'at least one field is required',
  //     field: 'body',
  //   })
  //   return errors
  // }

  // const allowedKeys = ['title', 'shortDescription', 'content', 'blogId']
  //
  // // Check for unexpected keys in the body
  // Object.keys(body).forEach((key) => {
  //   if (!allowedKeys.includes(key)) {
  //     errors.errorsMessages.push({
  //       message: `unexpected key '${key}' found`,
  //       field: key,
  //     })
  //   }
  // })

  // check if body has title key (required)
  if (!body.title) {
    errors.errorsMessages.push({
      message: 'title is required',
      field: 'title',
    })
  } else if (!body.title.trim().length) {
    errors.errorsMessages.push({
      message: 'title is empty',
      field: 'title',
    })
  } else if (body.title.length > 30) {
    errors.errorsMessages.push({
      message: 'title max length is 30',
      field: 'title',
    })
  }
  // // check if body has title key (is not obligatory)
  // if ('title' in body) {
  //   // check if name is string
  //   if (typeof body.title !== 'string') {
  //     errors.errorsMessages.push({
  //       message: 'title must be string',
  //       field: 'title',
  //     })
  //   }
  //   // check if title length is not more than 30
  //   else if (body.title.length > 30) {
  //     errors.errorsMessages.push({
  //       message: 'title max length is 30',
  //       field: 'title',
  //     })
  //   }
  // }

  // check if body has shortDescription key (required)
  if (!body.shortDescription) {
    errors.errorsMessages.push({
      message: 'shortDescription is required',
      field: 'shortDescription',
    })
  } else if (!body.shortDescription.trim().length) {
    errors.errorsMessages.push({
      message: 'shortDescription is empty',
      field: 'shortDescription',
    })
  } else if (body.shortDescription.length > 100) {
    errors.errorsMessages.push({
      message: 'shortDescription max length is 100',
      field: 'shortDescription',
    })
  }
  // // check if body has shortDescription key (is not obligatory)
  // if ('shortDescription' in body) {
  //   // check if shortDescription is string
  //   if (typeof body.shortDescription !== 'string') {
  //     errors.errorsMessages.push({
  //       message: 'shortDescription must be string',
  //       field: 'shortDescription',
  //     })
  //   }
  //   // check if shortDescription length is not more than 100
  //   else if (body.shortDescription.length > 100) {
  //     errors.errorsMessages.push({
  //       message: 'shortDescription max length is 100',
  //       field: 'shortDescription',
  //     })
  //   }
  // }

  // check if body has content key (required)
  if (!body.content) {
    errors.errorsMessages.push({
      message: 'content is required',
      field: 'content',
    })
  } else if (!body.content.trim().length) {
    errors.errorsMessages.push({
      message: 'content is empty',
      field: 'content',
    })
  } else if (body.content.length > 1000) {
    errors.errorsMessages.push({
      message: 'content max length is 1000',
      field: 'content',
    })
  }
  // // check if body has content key (is not obligatory)
  // if ('content' in body) {
  //   // check if content is string
  //   if (typeof body.content !== 'string') {
  //     errors.errorsMessages.push({
  //       message: 'content must be string',
  //       field: 'content',
  //     })
  //   }
  //   // check if content length is not more than 1000
  //   else if (body.content.length > 1000) {
  //     errors.errorsMessages.push({
  //       message: 'content max length is 1000',
  //       field: 'content',
  //     })
  //   }
  // }

  // check if body has blogId key (required)
  if (!body.blogId) {
    errors.errorsMessages.push({
      message: 'blogId is required',
      field: 'blogId',
    })
  }
  // // check if body has blogId key (is not obligatory)
  // if ('blogId' in body) {
  //   // check if blogId is string
  //   if (typeof body.blogId !== 'string') {
  //     errors.errorsMessages.push({
  //       message: 'blogId must be string',
  //       field: 'blogId',
  //     })
  //   }
  //   // check if blogId exists
  //   if (!body.blogId) {
  //     errors.errorsMessages.push({
  //       message: 'blogId is required',
  //       field: 'blogId',
  //     })
  //   }
  // }

  return errors
}
