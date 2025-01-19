import {
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  FindUserRequest,
  FindUserResponse,
  GetArrangedUsersRequest,
  GetArrangedUsersResponse,
} from '../types'
import {
  handleCustomError,
  handleResponseError,
  handleResponseNotFoundError,
  HTTP_STATUS_CODES,
} from '../common'
import { userService } from '../services'
import { userQueryRepository } from '../queryRepositories'
import { userQueryService } from '../queryServices'

export const userControllers = {
  getArrangedUsers: async (
    req: GetArrangedUsersRequest,
    res: GetArrangedUsersResponse,
  ): Promise<void> => {
    const { query } = req

    const users = await userQueryService.getArrangedUsers(query)

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
      handleResponseNotFoundError(res, 'NOT_FOUND_404', 'user')
    }
  },

  createUser: async (req: CreateUserRequest, res: CreateUserResponse): Promise<void> => {
    const { body } = req
    try {
      const createdUserId = await userService.createUser(body)
      if (createdUserId) {
        const createdUser = await userQueryRepository.findUserById(createdUserId)
        if (createdUser) {
          res.status(HTTP_STATUS_CODES.CREATED_201).json(createdUser)
        } else {
          handleResponseError(res, 'BAD_REQUEST_400')
        }
      } else {
        handleResponseError(res, 'BAD_REQUEST_400')
      }
    } catch (error) {
      handleCustomError(res, error)
    }
  },

  deleteUser: async (req: DeleteUserRequest, res: DeleteUserResponse): Promise<void> => {
    const { id } = req.params

    try {
      const deletedUserId = await userService.deleteUser(id)

      if (deletedUserId) {
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
      } else {
        handleResponseError(res, 'BAD_REQUEST_400')
      }
    } catch (error) {
      handleCustomError(res, error)
    }
  },
}
