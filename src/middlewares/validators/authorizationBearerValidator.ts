import { NextFunction, Request, Response } from 'express'
import { handleResponseError, handleResponseNotAuthorizedError } from '../../common'
import { authService } from '../../services'
import { ResultStatus } from '../../types'

export const authorizationBearerValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization']

  const result = await authService.me(authHeader)

  const status = result?.status
  const data = result?.data
  const extensions = result?.extensions

  if (status === ResultStatus.Success && data) {
    req.user = data
    next()
  } else if (status === ResultStatus.Unauthorized) {
    handleResponseNotAuthorizedError(res, extensions)
  } else {
    handleResponseError(res, 'BAD_REQUEST_400')
  }
}
