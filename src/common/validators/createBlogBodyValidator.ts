import { CreateBlogBody, OutputErrorsType } from '../../types'

export const createBlogBodyValidator = (body: CreateBlogBody) => {
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

  // const allowedKeys = ['name', 'websiteUrl', 'description']
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

  if (!body.name) {
    errors.errorsMessages.push({
      message: 'name is required',
      field: 'name',
    })
  } else if (body.name.length > 15) {
    errors.errorsMessages.push({
      message: 'name max length is 15',
      field: 'name',
    })
  }

  if (!body.description) {
    errors.errorsMessages.push({
      message: 'description is required',
      field: 'description',
    })
  } else if (body.description.length > 500) {
    errors.errorsMessages.push({
      message: 'description max length is 500',
      field: 'description',
    })
  }

  if (!body.websiteUrl) {
    errors.errorsMessages.push({
      message: 'websiteUrl is required',
      field: 'websiteUrl',
    })
  } else if (body.websiteUrl.length > 100) {
    errors.errorsMessages.push({
      message: 'websiteUrl max length is 100',
      field: 'websiteUrl',
    })
  } else if (!/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-.]*)*\/?$/i.test(body.websiteUrl)) {
    errors.errorsMessages.push({
      message: 'websiteUrl incorrect format',
      field: 'websiteUrl',
    })
  }

  return errors
}
