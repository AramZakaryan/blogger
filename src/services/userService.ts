import { userRepository } from '../repositories'
import { CreateUserBody, UserDbType, UserViewModel } from '../types'
import { userQueryRepository } from '../queryRepositories'
import bcrypt from 'bcrypt'
import { HTTP_STATUS_CODES } from '../common'

export const userService = {
  createUser: async (body: CreateUserBody): Promise<UserViewModel['id'] | null> => {
    const { login, email, password } = body

    // check if user with given email is unique
    const usersWithEmail = await userQueryRepository.findUserByEmail(email)
    if (usersWithEmail) {
      throw new Error(
        JSON.stringify({
          statusCode: HTTP_STATUS_CODES.CONFLICT_409,
          errorsMessages: [
            {
              message: 'email should be unique',
              field: 'email',
            },
          ],
        }),
      )
    }

    // check if user with given login is unique
    const usersWithLogin = await userQueryRepository.findUserByLogin(login)
    if (usersWithLogin) {
      throw new Error(
        JSON.stringify({
          statusCode: HTTP_STATUS_CODES.CONFLICT_409,
          errorsMessages: [
            {
              message: 'login should be unique',
              field: 'login',
            },
          ],
        }),
      )
    }

    try {
      const passwordHash = await bcrypt.hash(password, 12)

      const userNormalized: UserDbType = {
        login,
        email,
        password: passwordHash,
        createdAt: new Date(),
      }

      const createdUserId = await userRepository.createUser(userNormalized)

      if (!createdUserId) return null

      return createdUserId
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  deleteUser: async (id: UserViewModel['id']): Promise<UserViewModel['id'] | null> => {
    // check if user with given id exists
    const usersWithEmail = await userQueryRepository.findUserById(id)
    if (!usersWithEmail) {
      throw new Error(
        JSON.stringify({
          statusCode: HTTP_STATUS_CODES.NOT_FOUND_404,
          errorsMessages: [
            {
              message: 'user with provided id does not exist',
              field: 'params',
            },
          ],
        }),
      )
    }

    try {
      return await userRepository.deleteUser(id)
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
