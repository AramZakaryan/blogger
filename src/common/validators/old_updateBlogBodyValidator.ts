import { OutputErrorsType, UpdateBlogBody, UpdateBlogParams } from '../../types'

export const old_updateBlogBodyValidator = (body: UpdateBlogBody) => {
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

  // check if body has name key (required)
  if (!body.name) {
    errors.errorsMessages.push({
      message: 'name is required',
      field: 'name',
    })
  } else if (!body.name.trim().length) {
    errors.errorsMessages.push({
      message: 'name is empty',
      field: 'name',
    })
  }else if (body.name.length > 15) {
    errors.errorsMessages.push({
      message: 'name max length is 15',
      field: 'name',
    })
  }
  // // check if body has name key (is not obligatory)
  // if ('name' in body) {
  //   // check if name is string
  //   if (typeof body.name !== 'string') {
  //     errors.errorsMessages.push({
  //       message: 'name must be string',
  //       field: 'name',
  //     })
  //   }
  //   // check if name length is not more than 15
  //   else if (body.name.length > 15) {
  //     errors.errorsMessages.push({
  //       message: 'name max length is 15',
  //       field: 'name',
  //     })
  //   }
  // }

  // check if body has description key (required)
  if (!body.description) {
    errors.errorsMessages.push({
      message: 'description is required',
      field: 'description',
    })
  } else if (!body.description.trim().length) {
    errors.errorsMessages.push({
      message: 'description is empty',
      field: 'description',
    })
  } else if (body.description.length > 500) {
    errors.errorsMessages.push({
      message: 'description max length is 500',
      field: 'description',
    })
  }
  // // check if body has description key (is not obligatory)
  // if ('description' in body) {
  //   // check if description is string
  //   if (typeof body.description !== 'string') {
  //     errors.errorsMessages.push({
  //       message: 'description must be string',
  //       field: 'description',
  //     })
  //   }
  //   // check if description length is not more than 500
  //   else if (body.description.length > 500) {
  //     errors.errorsMessages.push({
  //       message: 'description max length is 500',
  //       field: 'description',
  //     })
  //   }
  // }

  // check if body has websiteUrl key (required)
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
  // // check if body has websiteUrl key (is not obligatory)
  // if ('websiteUrl' in body) {
  //   // check if websiteUrl is string
  //   if (typeof body.websiteUrl !== 'string') {
  //     errors.errorsMessages.push({
  //       message: 'websiteUrl must be string',
  //       field: 'websiteUrl',
  //     })
  //   }
  //   // check if websiteUrl length is not more than 100
  //   else if (body.websiteUrl.length > 100) {
  //     errors.errorsMessages.push({
  //       message: 'websiteUrl max length is 100',
  //       field: 'websiteUrl',
  //     })
  //   }
  //   // check if websiteUrl is correct format
  //   else if (!/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-.]*)*\/?$/i.test(body.websiteUrl)) {
  //     errors.errorsMessages.push({
  //       message: 'websiteUrl incorrect format',
  //       field: 'websiteUrl',
  //     })
  //   }
  // }

  return errors
}