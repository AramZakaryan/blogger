import { WithId } from 'mongodb'
import { ArrangementQuery } from '../general'
import { UserType, UserViewModel } from '../user.type'

export type GetArrangedUsersQuery = ArrangementQuery<UserViewModel> & {
  searchLoginTerm?: string
  searchEmailTerm?: string
}

export type FindUserParams = { id: string }

export type CreateUserBody = Omit<WithId<UserType>, '_id' | 'createdAt'>

export type DeleteUserParams = FindUserParams

////////// in auth path

export type LoginUserBody = {
  loginOrEmail: string
  password: string
}
