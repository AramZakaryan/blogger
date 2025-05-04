import { LoginRequest, LoginResponse, MeRequest, MeResponse, ResultStatus } from '../types'
import { authService } from '../services'
import {
  handleResponseError,
  handleResponseCredentialsError,
  HTTP_STATUS_CODES,
  handleResponseNotAuthorizedError,
} from '../common'

export const authControllers = {
  login: async (req: LoginRequest, res: LoginResponse): Promise<void> => {
    const { body } = req

    const result = await authService.login(body)

    const status = result?.status
    const data = result?.data

    if (status === ResultStatus.Success && data) {
      res.status(HTTP_STATUS_CODES.OK_200).json(data)
    } else if (status === ResultStatus.Unauthorized) {
      handleResponseCredentialsError(res)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },
  me: async (req: MeRequest, res: MeResponse): Promise<void> => {
    const authHeader = req.headers['authorization']

    const result = await authService.me(authHeader)

    const status = result?.status
    const data = result?.data
    const extensions = result?.extensions

    if (status === ResultStatus.Success && data) {
      res.status(HTTP_STATUS_CODES.OK_200).json(data)
    } else if (status === ResultStatus.Unauthorized) {
      handleResponseNotAuthorizedError(res, extensions)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },
}
