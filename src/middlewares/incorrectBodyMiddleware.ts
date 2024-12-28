import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS_CODES } from '../common/httpStatusCodes'

/** Custom error-handling middleware for checking req.body */
export const incorrectBodyMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if it’s a JSON parse error
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({
      errorsMessages: [
        {
          message: 'body is incorrect',
          field: 'body',
        },
      ],
    })
  } else {
    // Not a JSON parse error, let other error utils (or default) handle it
    next(err)
  }
}
