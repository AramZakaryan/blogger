import { NextFunction, Request, Response } from 'express'

/** Custom error-handling middleware for checking req.body */
export const incorrectBodyMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if it’s a JSON parse error
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
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
