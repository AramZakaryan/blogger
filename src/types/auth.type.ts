import { UserDbType } from './user.type'

export type AccessTokenViewModel = {
  accessToken: string
}

export type UserViewForMeModel = Omit<UserDbType, 'password' | 'createdAt'> & {
  userId: string
}