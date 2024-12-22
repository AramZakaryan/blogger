import { Request, Response, NextFunction } from 'express'

export const headersValidator = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Basic YWRtaW46cXdlcnR5')) {
    res.status(401).json({
      errorsMessages: [
        {
          message: 'headers required',
          field: 'headers',
        },
      ],
    })
    return
  }
  next()
}
