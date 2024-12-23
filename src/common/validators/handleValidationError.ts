import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationError } from 'express-validator'
import { OutputErrorsType } from '../../types'

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // Transform errors into OutputErrorsType
    const outputErrors: OutputErrorsType = {
      errorsMessages: errors.array().map((err: ValidationError) => ({
        message: err.msg.message,
        field: err.msg.field,
      })),
    }
    res.status(400).json(outputErrors)
  } else {
    next()
  }
}
