import { BlogDbType, BlogViewModel, UserDbType, UserViewForMeModel, UserViewModel } from '../../types'
import { WithId } from 'mongodb'

export const userMap = (user: WithId<UserDbType>): UserViewModel => ({
  id: user._id.toString(),
  login: user.login,
  email: user.email,
  createdAt: user.createdAt.toISOString(),
})

export const userForMeMap = (user: UserViewModel): UserViewForMeModel => ({
  userId: user.id,
  login: user.login,
  email: user.email,
})