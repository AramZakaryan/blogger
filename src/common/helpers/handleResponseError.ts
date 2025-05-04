import { HTTP_STATUS_CODES } from '../httpStatusCodes'
import { Response } from 'express'
import { Result } from '../../types'

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

export const handleResponseCredentialsError = (response: Response) => {
  return response.status(HTTP_STATUS_CODES.UNAUTHORIZED_401).json({
    errorsMessages: [
      {
        message: `login, email or password is incorrect`,
        field: 'loginOrEmail or password',
      },
    ],
  })
}

export const handleResponseNotAuthorizedError = (
  response: Response,
  extensions: Result['extensions'],
) => {
  return response.status(HTTP_STATUS_CODES.UNAUTHORIZED_401).json({
    errorsMessages: extensions,
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
