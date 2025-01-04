import { userRepository } from '../repositories'
import {
  ArrangedUsersViewModel,
  CreateUserBody,
  CreateUserResult,
  GetArrangedUsersQuery,
  UserType,
} from '../types'
import { userQueryRepository } from '../queryRepositories'
import bcrypt from 'bcrypt'

export const userService = {
  getArrangedUsers: async (
    query: GetArrangedUsersQuery,
  ): Promise<ArrangedUsersViewModel | null> => {
    const queryNormalized: Required<GetArrangedUsersQuery> = {
      pageNumber: query.pageNumber || 1,
      pageSize: query.pageSize || 10,
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection || 'desc',
      searchLoginTerm: query.searchLoginTerm || '',
      searchEmailTerm: query.searchEmailTerm || '',
    }

    try {
      let users = await userQueryRepository.getArrangedUsers(queryNormalized)

      users ??= []

      let usersCount = await userQueryRepository.getUsersCount(
        queryNormalized.searchLoginTerm,
        queryNormalized.searchEmailTerm,
      )

      usersCount ??= 0

      const pagesCount = Math.ceil(usersCount / queryNormalized.pageSize)

      return {
        pagesCount,
        page: queryNormalized.pageNumber,
        pageSize: queryNormalized.pageSize,
        totalCount: pagesCount,
        items: users,
      }
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  createUser: async (body: CreateUserBody): Promise<CreateUserResult | null> => {
    const { login, email, password } = body

    // checking if the user with given login or email is unique
    try {
      const usersWithEmail = await userQueryRepository.findUserByEmail(email)

      if (usersWithEmail)
        return {
          errors: {
            errorsMessages: [
              {
                message: 'email should be unique',
                field: 'email',
              },
            ],
          },
        }

      const usersWithLogin = await userQueryRepository.findUserByLogin(login)

      if (usersWithLogin)
        return {
          errors: {
            errorsMessages: [
              {
                message: 'login should be unique',
                field: 'login',
              },
            ],
          },
        }
    } catch (err) {
      // console.log(err)
      return null
    }

    try {
      const passwordHash = await bcrypt.hash(password, 12)

      const userNormalized: UserType = {
        login,
        email,
        password: passwordHash,
        createdAt: new Date(),
      }

      const id = await userRepository.createUser(userNormalized)

      if (!id) return null

      const user = await userQueryRepository.findUserById(id)

      if (!user) return null

      return { user }
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
