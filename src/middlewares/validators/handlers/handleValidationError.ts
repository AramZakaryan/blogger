import { NextFunction, Request, Response } from 'express'
import { ValidationError, validationResult } from 'express-validator'
import { OutputErrorsType } from '../../../types'
import { HTTP_STATUS_CODES, toObjectIfJson } from '../../../common'

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  // console.log( errors)

  if (!errors.isEmpty()) {
    // Transform errors into OutputErrorsType
    const outputErrors: OutputErrorsType = {
      errorsMessages: errors.array({ onlyFirstError: true }).map((err: ValidationError) => {
        const msg = toObjectIfJson(err.msg)
        return {
          message: msg.message,
          field: msg.field,
        }
      }),
    }

    const status = outputErrors.errorsMessages.some(({ field }) => field === 'params')
      ? HTTP_STATUS_CODES.NOT_FOUND_404
      : HTTP_STATUS_CODES.BAD_REQUEST_400

    res.status(status).json(outputErrors)
  } else {
    next()
  }
}
