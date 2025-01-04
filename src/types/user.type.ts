import { ArrangedViewModel, OutputErrorsType } from './general'
import { ObjectId } from 'mongodb'

export type UserType = {
  login: string // minLength: 3; maxLength: 10
  password: string // minLength: 6; maxLength: 20
  email: string
  createdAt: Date
}

export type UserDbType = UserType & {
  _id: ObjectId
}

export type UserViewModel = Omit<UserType, 'password' | 'createdAt'> & {
  id: string
  createdAt: string
}

export type ArrangedUsersViewModel = ArrangedViewModel<UserViewModel>

export type CreateUserResult = {
  user?: UserViewModel
  errors?: OutputErrorsType
}
