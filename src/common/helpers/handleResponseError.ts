import { HTTP_STATUS_CODES } from '../httpStatusCodes'
import { Response } from 'express'

export const handleResponseError = (
  response: Response,
  statusCode: keyof typeof HTTP_STATUS_CODES,
) => {
  return response.status(HTTP_STATUS_CODES[statusCode]).json({
    errorsMessages: [
      {
        message: 'something went wrong',
        field: 'unknown',
      },
    ],
  })
}

export const handleResponseNotFoundError = (
  response: Response,
  statusCode: keyof typeof HTTP_STATUS_CODES,
  item: 'blog' | 'post' | 'user' | 'comment',
) => {
  return response.status(HTTP_STATUS_CODES[statusCode]).json({
    errorsMessages: [
      {
        message: `${item} with provided id does not exist`,
        field: 'params',
      },
    ],
  })
}

export const handleCustomError = (response: Response, error: any) => {
  if (error?.message) {
    try {
      const errorParsed = JSON.parse(error.message)

      if (errorParsed?.statusCode && errorParsed?.errorsMessages) {
        response.status(errorParsed.statusCode).json({ errorsMessages: errorParsed.errorsMessages })
      } else {
        handleResponseError(response, 'BAD_REQUEST_400')
      }
    } catch (parseError) {
      handleResponseError(response, 'BAD_REQUEST_400')
    }
  } else {
    handleResponseError(response, 'BAD_REQUEST_400')
  }
}
