import { LoginUserBody, Result, ResultCode } from '../types'
import bcrypt from 'bcrypt'
import { userQueryRepository } from '../queryRepositories'
import { HTTP_STATUS_CODES } from '../common'

export const authService = {
  loginUser: async (body: LoginUserBody): Promise<boolean | null> => {
    try {
      const { loginOrEmail, password } = body

      const user = await userQueryRepository.findUserByLoginOrEmail(loginOrEmail)

      if (!user) return false

      const isPasswordCorrect = await bcrypt.compare(password, user.password)

      // const accessToken = await bcrypt.compare(password, user.password)
      //
      // const result: Result<{ accessToken: string }> = {
      //   status: ResultCode.Success,
      //   data: { accessToken },
      // }

      if (isPasswordCorrect) {
        return true
      } else {
        return false
      }
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
