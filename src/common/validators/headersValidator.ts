import { Request, Response, NextFunction } from 'express'

export const headersValidator = (req: Request, res: Response, next: NextFunction) => {
  // if (req.headers['Authorization'] !== 'Basic YWRtaW46cXdlcnR5') {
  //   res.status(401).json({
  //     errorsMessages: [
  //       {
  //         message: 'headers required',
  //         field: 'headers',
  //       },
  //     ],
  //   })
  //   return
  // }
  next()
}
