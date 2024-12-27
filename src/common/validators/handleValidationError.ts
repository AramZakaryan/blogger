import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationError } from 'express-validator'
import { OutputErrorsType } from '../../types'
import { toObjectIfJson } from '../utils/toObjectIfJson'

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)


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

    const status = outputErrors.errorsMessages.some(({ field }) => field === 'params') ? 404 : 400

    res.status(status).json(outputErrors)
  } else {
    next()
  }
}
