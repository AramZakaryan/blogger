import { userRepository } from '../repositories'
import {
  ArrangedUsersViewModel,
  CreateUserBody,
  RegisterUserResult,
  GetArrangedUsersQuery,
  UserDbType,
} from '../types'
import { userQueryRepository } from '../queryRepositories'
import bcrypt from 'bcrypt'

export const userQueryService = {
  getArrangedUsers: async (
    query: GetArrangedUsersQuery,
  ): Promise<ArrangedUsersViewModel | null> => {
    const queryNormalized: Required<GetArrangedUsersQuery> = {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
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
        totalCount: usersCount,
        items: users,
      }
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
