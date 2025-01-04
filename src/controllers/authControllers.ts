import { LoginUserRequest } from '../types'
import { Response } from 'express'
import { authService } from '../services'
import { handleResponseError, HTTP_STATUS_CODES } from '../common'

export const authControllers = {
  loginUser: async (req: LoginUserRequest, res: Response): Promise<void> => {
    const { body } = req

    const result = await authService.loginUser(body)

    if (result === true) {
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    } else if (result === false) {
      res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },
}
