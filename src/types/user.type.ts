import { ArrangedViewModel, OutputErrorsType } from './general'

export type UserDbType = {
  login: string // minLength: 3; maxLength: 10
  password: string // minLength: 6; maxLength: 20
  email: string
  createdAt: Date
  emailConfirmation: {
    confirmationCode: string // UUID
    expirationDate: Date
    isConfirmed: boolean
  }
}

export type UserViewModel = Omit<UserDbType, 'password' | 'createdAt' | 'emailConfirmation'> & {
  id: string
  createdAt: string
}

export type ArrangedUsersViewModel = ArrangedViewModel<UserViewModel>

export type RegisterUserResult = {
  user?: UserViewModel
  errors?: OutputErrorsType
}
