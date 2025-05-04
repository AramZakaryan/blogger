import { Request } from 'express'
import { CreateUserBody, DeleteUserParams, FindUserParams, GetArrangedUsersQuery } from '../dto'

export type GetArrangedUsersRequest = Request<{}, any, {}, GetArrangedUsersQuery>

export type FindUserRequest = Request<FindUserParams>

export type CreateUserRequest = Request<{}, any, CreateUserBody>

export type DeleteUserRequest = Request<DeleteUserParams>