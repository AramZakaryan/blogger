import { WithId } from 'mongodb'
import { ArrangementQuery } from '../general'
import { UserDbType, UserViewModel } from '../user.type'

export type GetArrangedUsersQuery = ArrangementQuery<UserViewModel> & {
  searchLoginTerm?: string
  searchEmailTerm?: string
}

export type FindUserParams = { id: string }

export type CreateUserBody = Omit<WithId<UserDbType>, '_id' | 'createdAt'>

export type DeleteUserParams = FindUserParams

////////// in auth path

export type LoginUserBody = {
  loginOrEmail: string
  password: string
}
