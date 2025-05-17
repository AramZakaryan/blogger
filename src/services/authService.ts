import {
  AccessTokenViewModel,
  LoginUserBody,
  Result,
  ResultStatus,
  UserViewForMeModel,
} from '../types'
import bcrypt from 'bcrypt'
import { userQueryRepository } from '../queryRepositories'
import { userForMeMap } from '../common'
import { JwtService } from './jwtService'

export const authService = {
  login: async (body: LoginUserBody): Promise<Result<AccessTokenViewModel> | null> => {
    try {
      const { loginOrEmail, password } = body

      const user = await userQueryRepository.findUserByLoginOrEmail(loginOrEmail)

      if (!user) {
        return {
          status: ResultStatus.Unauthorized,
          extensions: [{ field: 'loginOrEmail', message: 'login or email is incorrect' }],
          data: null,
        }
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password)

      if (!isPasswordCorrect) {
        return {
          status: ResultStatus.Unauthorized,
          extensions: [{ field: 'password', message: 'password is incorrect' }],
          data: null,
        }
      }

      const accessToken = JwtService.createToken(user._id.toString())

      return {
        status: ResultStatus.Success,
        data: { accessToken },
      }
    } catch (err) {
      // console.log(err)
      return null
    }
  },
  me: async (authHeader: string | undefined): Promise<Result<UserViewForMeModel> | null> => {
    try {
      if (!authHeader) {
        return {
          status: ResultStatus.Unauthorized,
          extensions: [{ field: `headers`, message: 'headers required' }],
          data: null,
        }
      }

      const token = authHeader.replace('Bearer ', '')

      const userId = JwtService.parseToken(token)

      if (!userId) {
        return {
          status: ResultStatus.Unauthorized,
          extensions: [{ field: `headers`, message: 'headers required' }],
          data: null,
        }
      }

      const user = await userQueryRepository.findUserById(userId)

      if (!user) {
        return {
          status: ResultStatus.Unauthorized,
          extensions: [{ field: `headers`, message: 'headers required' }],
          data: null,
        }
      }
      return {
        status: ResultStatus.Success,
        data: userForMeMap(user),
      }
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
