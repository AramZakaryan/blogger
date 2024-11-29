import { BlogDto, OutputErrorsType } from '../../types'

export const blogRequestValidator = (body: BlogDto) => {
  /** object for accumulating errors */
  const errors: OutputErrorsType = {
    errorsMessages: [],
  }

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
  }

  return errors
}
