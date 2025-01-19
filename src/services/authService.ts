import { LoginUserBody } from '../types'
import bcrypt from 'bcrypt'
import { userRepository } from '../repositories'

export const authService = {
  loginUser: async (body: LoginUserBody): Promise<boolean | null> => {
    try {
      const { loginOrEmail, password } = body

      const user = await userRepository.findUserByLoginOrEmail(loginOrEmail)

      if (!user) return false

      const isPasswordCorrect = await bcrypt.compare(password, user.password)

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
