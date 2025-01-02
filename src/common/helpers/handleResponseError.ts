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
