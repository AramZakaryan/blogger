import {
  CreateUserRequest,
  CreateUserResponse,
  DeleteBlogRequest,
  DeleteBlogResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  FindUserRequest,
  FindUserResponse,
  GetArrangedUsersRequest,
  GetArrangedUsersResponse,
} from '../types'
import { handleResponseError, HTTP_STATUS_CODES } from '../common'
import { userService } from '../services'
import { blogRepository, userRepository } from '../repositories'
import { userQueryRepository } from '../queryRepositories'

export const userControllers = {
  getArrangedUsers: async (
    req: GetArrangedUsersRequest,
    res: GetArrangedUsersResponse,
  ): Promise<void> => {
    const { query } = req

    const users = await userService.getArrangedUsers(query)

    if (users) {
      res.json(users)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  findUser: async (req: FindUserRequest, res: FindUserResponse): Promise<void> => {
    const { id } = req.params

    const user = await userQueryRepository.findUserById(id)

    if (user) {
      res.json(user)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  createUser: async (req: CreateUserRequest, res: CreateUserResponse): Promise<void> => {
    const { body } = req

    const result = await userService.createUser(body)

    if (result?.user) {
      res.status(HTTP_STATUS_CODES.CREATED_201).json(result.user)
    } else if (result?.errors) {
      res.status(HTTP_STATUS_CODES.CONFLICT_409).json(result.errors)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  deleteUser: async (req: DeleteUserRequest, res: DeleteUserResponse): Promise<void> => {
    const { id } = req.params

    const user = await userRepository.deleteUser(id)

    if (user) {
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },
}
