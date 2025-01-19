import { ArrangedViewModel, OutputErrorsType } from './general'
import { ObjectId } from 'mongodb'

export type UserDbType = {
  login: string // minLength: 3; maxLength: 10
  password: string // minLength: 6; maxLength: 20
  email: string
  createdAt: Date
}


export type UserViewModel = Omit<UserDbType, 'password' | 'createdAt'> & {
  id: string
  createdAt: string
}

export type ArrangedUsersViewModel = ArrangedViewModel<UserViewModel>

export type CreateUserResult = {
  user?: UserViewModel
  errors?: OutputErrorsType
}
