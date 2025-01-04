import { Response } from 'express'
import { OutputErrorsType } from '../general'
import { ArrangedUsersViewModel, UserViewModel } from '../user.type'

export type GetArrangedUsersResponse = Response<ArrangedUsersViewModel | OutputErrorsType>

export type FindUserResponse = Response<UserViewModel | OutputErrorsType>

export type CreateUserResponse = Response<UserViewModel | OutputErrorsType>

export type DeleteUserResponse = Response<void | OutputErrorsType>


